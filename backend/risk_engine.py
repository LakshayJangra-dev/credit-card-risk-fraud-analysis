"""
Risk Engine
------------
The orchestration layer that ties the Credit Risk Model and Fraud Detection Model
together into a single decision surface.

Entry points:
  - evaluate_application(applicant) -> loan approval decision
  - evaluate_transaction(transaction) -> fraud decision
  - evaluate_combined(applicant, recent_txns) -> holistic customer risk view
"""

from credit_risk_model import CreditRiskModel
from fraud_detection_model import FraudDetectionModel
from rules.bank_rules import BankEligibilityRules
import numpy as np


class RiskEngine:

    def __init__(
        self,
        credit_model: CreditRiskModel,
        fraud_model: FraudDetectionModel
    ):
        self.credit_model = credit_model
        self.fraud_model = fraud_model

    # ----------------------------------------------------------------
    # CREDIT APPLICATION
    # ----------------------------------------------------------------
    def evaluate_application(self, applicant: dict):

        # ------------------------------------------------------------
        # STEP 1: BANK ELIGIBILITY RULES
        # ------------------------------------------------------------

        eligibility = BankEligibilityRules.check(applicant)

        if not eligibility["eligible"]:
            return {
                "probability_of_default": None,
                "credit_score": None,
                "risk_tier": "INELIGIBLE",
                "decision": "DECLINE",
                "reason": "Applicant does not meet bank eligibility requirements.",
                "eligibility": eligibility,
            }

        # ------------------------------------------------------------
        # STEP 2: ML CREDIT RISK MODEL
        # ------------------------------------------------------------

        pd_value = self.credit_model.predict_pd(applicant)

        score = self.credit_model.pd_to_score(pd_value)

        tier = self.credit_model.score_to_tier(score)

        # ------------------------------------------------------------
        # STEP 3: CREDIT RISK DECISION
        # ------------------------------------------------------------

        if score >= 670:
            decision = "APPROVE"
            reason = "Strong credit profile, low default probability."

        elif score >= 580:
            decision = "REVIEW"
            reason = "Moderate risk — recommend manual underwriting review."

        else:
            decision = "DECLINE"
            reason = "High probability of default based on risk factors."

        return {
            "probability_of_default": round(pd_value, 4),
            "credit_score": score,
            "risk_tier": tier,
            "decision": decision,
            "reason": reason,
            "eligibility": eligibility,
        }

    # ----------------------------------------------------------------
    # FRAUD TRANSACTION
    # ----------------------------------------------------------------
    def evaluate_transaction(self, transaction: dict) -> dict:

        scores = self.fraud_model.predict_fraud_score(transaction)

        blended = scores["blended_score"]

        if blended >= 0.75:
            decision = "BLOCK"
            reason = (
                "High-confidence fraud signal — transaction blocked."
            )

        elif blended >= 0.4:
            decision = "STEP_UP_AUTH"
            reason = (
                "Elevated risk — require additional authentication "
                "(OTP/biometric)."
            )

        else:
            decision = "ALLOW"
            reason = "Low fraud risk — transaction approved."

        return {
            **scores,
            "decision": decision,
            "reason": reason
        }

    # ----------------------------------------------------------------
    # COMBINED ASSESSMENT
    # ----------------------------------------------------------------
    def evaluate_combined(
        self,
        applicant: dict,
        recent_transactions: list
    ) -> dict:

        credit_result = self.evaluate_application(applicant)

        # ------------------------------------------------------------
        # If applicant is not eligible, stop the combined assessment.
        # ------------------------------------------------------------

        if not credit_result["eligibility"]["eligible"]:
            return {
                "credit_assessment": credit_result,
                "behavioral_fraud_risk": {
                    "avg_recent_txn_risk": 0.0,
                    "max_recent_txn_risk": 0.0,
                },
                "composite_risk_score": None,
                "final_decision": "DECLINE",
                "notes": credit_result["eligibility"]["violations"],
            }

        # ------------------------------------------------------------
        # Calculate recent transaction fraud risk
        # ------------------------------------------------------------

        if recent_transactions:

            txn_scores = [
                self.fraud_model.predict_fraud_score(t)["blended_score"]
                for t in recent_transactions
            ]

            avg_txn_risk = float(np.mean(txn_scores))
            max_txn_risk = float(np.max(txn_scores))

        else:
            avg_txn_risk = 0.0
            max_txn_risk = 0.0

        # ------------------------------------------------------------
        # Composite Risk
        # ------------------------------------------------------------

        composite_risk = (
            0.75 * credit_result["probability_of_default"]
            + 0.25 * avg_txn_risk
        )

        final_decision = credit_result["decision"]

        notes = []

        if max_txn_risk >= 0.75:

            if final_decision == "APPROVE":
                final_decision = "REVIEW"

            notes.append(
                "Recent transaction activity shows high fraud-risk "
                "signal; flagged for manual review despite credit score."
            )

        elif avg_txn_risk >= 0.4 and final_decision == "APPROVE":

            final_decision = "REVIEW"

            notes.append(
                "Elevated behavioral risk from recent transactions "
                "warrants a second look."
            )

        return {
            "credit_assessment": credit_result,
            "behavioral_fraud_risk": {
                "avg_recent_txn_risk": round(avg_txn_risk, 4),
                "max_recent_txn_risk": round(max_txn_risk, 4),
            },
            "composite_risk_score": round(composite_risk, 4),
            "final_decision": final_decision,
            "notes": notes or ["No behavioral risk flags."],
        }