"""
Risk Engine
------------
The orchestration layer that ties the Credit Risk Model and Fraud Detection Model
together into a single decision surface, the way a real underwriting/transaction
monitoring system would sit in front of both scorecards.

Two entry points:
  - evaluate_application(applicant)        -> loan approval decision
  - evaluate_transaction(transaction)       -> fraud decision (real-time)
  - evaluate_combined(applicant, recent_txns) -> holistic customer risk view,
        e.g. for an existing cardholder applying for a credit line increase,
        where recent transaction behavior should influence the credit decision.
"""

from credit_risk_model import CreditRiskModel
from fraud_detection_model import FraudDetectionModel
import numpy as np


class RiskEngine:
    def __init__(self, credit_model: CreditRiskModel, fraud_model: FraudDetectionModel):
        self.credit_model = credit_model
        self.fraud_model = fraud_model

    # ---------------------------------------------------------------- credit
    def evaluate_application(self, applicant: dict) -> dict:
        pd_value = self.credit_model.predict_pd(applicant)
        score = self.credit_model.pd_to_score(pd_value)
        tier = self.credit_model.score_to_tier(score)

        if score >= 670:
            decision, reason = "APPROVE", "Strong credit profile, low default probability."
        elif score >= 580:
            decision, reason = "REVIEW", "Moderate risk — recommend manual underwriting review."
        else:
            decision, reason = "DECLINE", "High probability of default based on risk factors."

        return {
            "probability_of_default": round(pd_value, 4),
            "credit_score": score,
            "risk_tier": tier,
            "decision": decision,
            "reason": reason,
        }

    # ---------------------------------------------------------------- fraud
    def evaluate_transaction(self, transaction: dict) -> dict:
        scores = self.fraud_model.predict_fraud_score(transaction)
        blended = scores["blended_score"]

        if blended >= 0.75:
            decision, reason = "BLOCK", "High-confidence fraud signal — transaction blocked."
        elif blended >= 0.4:
            decision, reason = "STEP_UP_AUTH", "Elevated risk — require additional authentication (OTP/biometric)."
        else:
            decision, reason = "ALLOW", "Low fraud risk — transaction approved."

        return {**scores, "decision": decision, "reason": reason}

    # ------------------------------------------------------------ combined
    def evaluate_combined(self, applicant: dict, recent_transactions: list) -> dict:
        """
        Holistic view: blend credit risk with a behavioral fraud-risk signal
        derived from the customer's recent transaction pattern. Useful for
        credit-line-increase requests, account monitoring, or re-underwriting.
        """
        credit_result = self.evaluate_application(applicant)

        if recent_transactions:
            txn_scores = [
                self.fraud_model.predict_fraud_score(t)["blended_score"]
                for t in recent_transactions
            ]
            avg_txn_risk = float(np.mean(txn_scores))
            max_txn_risk = float(np.max(txn_scores))
        else:
            avg_txn_risk, max_txn_risk = 0.0, 0.0

        # Composite risk: credit PD dominates, but recent suspicious activity
        # can pull down an otherwise-approved decision (identity/account risk).
        composite_risk = 0.75 * credit_result["probability_of_default"] + 0.25 * avg_txn_risk

        final_decision = credit_result["decision"]
        notes = []
        if max_txn_risk >= 0.75:
            final_decision = "REVIEW" if final_decision == "APPROVE" else final_decision
            notes.append("Recent transaction activity shows high fraud-risk signal; flagged for manual review despite credit score.")
        elif avg_txn_risk >= 0.4 and final_decision == "APPROVE":
            final_decision = "REVIEW"
            notes.append("Elevated behavioral risk from recent transactions warrants a second look.")

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
