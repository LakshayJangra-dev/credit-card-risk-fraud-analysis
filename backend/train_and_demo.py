"""
End-to-end demo: generates data, trains both models, saves them, and runs
sample scenarios through the combined RiskEngine.

Run with: python3 train_and_demo.py
"""

from data_generator import generate_credit_applicants, generate_transactions
from credit_risk_model import CreditRiskModel
from fraud_detection_model import FraudDetectionModel
from risk_engine import RiskEngine
import json


def banner(text):
    print("\n" + "=" * 70)
    print(text)
    print("=" * 70)


def main():
    banner("STEP 1: Generating synthetic data")
    applicants = generate_credit_applicants(n=8000)
    transactions = generate_transactions(n=20000)
    print(f"Applicants: {len(applicants)} rows | default rate = {applicants.defaulted.mean():.2%}")
    print(f"Transactions: {len(transactions)} rows | fraud rate = {transactions.is_fraud.mean():.2%}")

    banner("STEP 2: Training Credit Risk Model")
    credit_model = CreditRiskModel()
    credit_model.fit(applicants)
    print("Top feature importances:")
    for feat, imp in list(credit_model.feature_importance().items())[:5]:
        print(f"  {feat:28s} {imp:.4f}")
    credit_model.save()

    banner("STEP 3: Training Fraud Detection Model")
    fraud_model = FraudDetectionModel()
    fraud_model.fit(transactions)
    print("Top feature importances:")
    for feat, imp in list(fraud_model.feature_importance().items())[:5]:
        print(f"  {feat:28s} {imp:.4f}")
    fraud_model.save()

    banner("STEP 4: Running scenarios through the combined Risk Engine")
    engine = RiskEngine(credit_model, fraud_model)

    # Scenario A: Strong applicant, clean transactions
    good_applicant = {
        "age": 41, "annual_income": 95000, "employment_years": 12, "existing_debt": 8000,
        "credit_history_years": 18, "num_late_payments_2y": 0, "debt_to_income": 8000/95000,
        "loan_amount": 15000, "loan_to_income": 15000/95000, "num_credit_lines": 5,
        "recent_credit_inquiries": 1,
    }
    good_txns = [{
        "amount": 45.0, "hour": 14, "is_night": 0, "merchant_risk_score": 0.05,
        "distance_from_home_km": 3, "txns_last_24h": 2, "is_new_device": 0,
        "is_new_merchant": 0, "card_present": 1, "velocity_amount_24h": 120,
    } for _ in range(3)]

    result_a = engine.evaluate_combined(good_applicant, good_txns)
    print("\nScenario A — Strong applicant, normal spending:")
    print(json.dumps(result_a, indent=2))

    # Scenario B: Weak applicant, and recent suspicious transactions
    risky_applicant = {
        "age": 24, "annual_income": 28000, "employment_years": 1, "existing_debt": 14000,
        "credit_history_years": 2, "num_late_payments_2y": 4, "debt_to_income": 14000/28000,
        "loan_amount": 12000, "loan_to_income": 12000/28000, "num_credit_lines": 12,
        "recent_credit_inquiries": 5,
    }
    risky_txns = [{
        "amount": 890.0, "hour": 3, "is_night": 1, "merchant_risk_score": 0.72,
        "distance_from_home_km": 210, "txns_last_24h": 7, "is_new_device": 1,
        "is_new_merchant": 1, "card_present": 0, "velocity_amount_24h": 3200,
    }]

    result_b = engine.evaluate_combined(risky_applicant, risky_txns)
    print("\nScenario B — Weak applicant, suspicious recent transaction:")
    print(json.dumps(result_b, indent=2))

    # Scenario C: standalone real-time fraud check
    single_txn = {
        "amount": 1200.0, "hour": 2, "is_night": 1, "merchant_risk_score": 0.6,
        "distance_from_home_km": 500, "txns_last_24h": 5, "is_new_device": 1,
        "is_new_merchant": 1, "card_present": 0, "velocity_amount_24h": 4800,
    }
    result_c = engine.evaluate_transaction(single_txn)
    print("\nScenario C — Standalone real-time fraud check:")
    print(json.dumps(result_c, indent=2))

    banner("Done. Models saved to disk (credit_risk_model.joblib, fraud_model_*.joblib)")


if __name__ == "__main__":
    main()
