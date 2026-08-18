"""
Synthetic data generator for the Credit Risk & Fraud Analysis system.

Generates two related datasets:
1. Credit applicants  -> used to train/score the CREDIT RISK model (probability of default)
2. Transactions       -> used to train/score the FRAUD DETECTION model (probability of fraud)

Both are synthetic but built with realistic, correlated feature relationships so the
downstream models learn genuine (if simplified) signal rather than pure noise.
"""

import numpy as np
import pandas as pd


def generate_credit_applicants(n=8000, seed=42):
    rng = np.random.default_rng(seed)

    age = rng.integers(18, 75, n)
    annual_income = rng.gamma(shape=6, scale=9000, size=n) + 15000
    employment_years = np.clip(rng.normal(loc=(age - 18) / 3, scale=3), 0, None)
    existing_debt = rng.gamma(shape=2, scale=4000, size=n)
    credit_history_years = np.clip(rng.normal(loc=(age - 18) / 2.2, scale=2.5), 0, None)
    num_late_payments_2y = rng.poisson(lam=np.clip(1.5 - credit_history_years / 20, 0, None), size=n)
    debt_to_income = existing_debt / (annual_income + 1)
    loan_amount = rng.gamma(shape=3, scale=3500, size=n)
    loan_to_income = loan_amount / (annual_income + 1)
    num_credit_lines = rng.integers(0, 15, n)
    recent_credit_inquiries = rng.poisson(lam=1.2, size=n)

    # Latent default risk score (logit) built from realistic weighted drivers
    logit = (
        -3.2
        + 2.6 * debt_to_income
        + 0.55 * num_late_payments_2y
        + 1.8 * loan_to_income
        + 0.18 * recent_credit_inquiries
        - 0.05 * credit_history_years
        - 0.00002 * annual_income
        + 0.10 * (num_credit_lines > 10).astype(float)
        - 0.04 * employment_years
        + rng.normal(0, 0.6, n)  # unobserved noise
    )
    default_prob = 1 / (1 + np.exp(-logit))
    defaulted = rng.binomial(1, np.clip(default_prob, 0.01, 0.95))

    df = pd.DataFrame({
        "applicant_id": [f"APP{100000+i}" for i in range(n)],
        "age": age,
        "annual_income": annual_income.round(2),
        "employment_years": employment_years.round(1),
        "existing_debt": existing_debt.round(2),
        "credit_history_years": credit_history_years.round(1),
        "num_late_payments_2y": num_late_payments_2y,
        "debt_to_income": debt_to_income.round(4),
        "loan_amount": loan_amount.round(2),
        "loan_to_income": loan_to_income.round(4),
        "num_credit_lines": num_credit_lines,
        "recent_credit_inquiries": recent_credit_inquiries,
        "defaulted": defaulted,
    })
    return df


def generate_transactions(n=20000, seed=7):
    rng = np.random.default_rng(seed)

    amount = rng.gamma(shape=2, scale=60, size=n)
    hour = rng.integers(0, 24, n)
    is_night = ((hour < 6) | (hour > 22)).astype(int)
    merchant_risk_score = rng.beta(2, 8, n)  # most merchants low risk
    distance_from_home_km = rng.gamma(shape=1.5, scale=15, size=n)
    txns_last_24h = rng.poisson(lam=2, size=n)
    is_new_device = rng.binomial(1, 0.08, n)
    is_new_merchant = rng.binomial(1, 0.15, n)
    card_present = rng.binomial(1, 0.6, n)
    velocity_amount_24h = amount * rng.uniform(1, 4, n) * (txns_last_24h + 1)

    logit = (
        -5.0
        + 0.012 * amount
        + 1.9 * is_night
        + 4.0 * merchant_risk_score
        + 0.02 * distance_from_home_km
        + 0.35 * txns_last_24h
        + 2.2 * is_new_device
        + 1.1 * is_new_merchant
        - 1.3 * card_present
        + 0.0009 * velocity_amount_24h
        + rng.normal(0, 0.7, n)
    )
    fraud_prob = 1 / (1 + np.exp(-logit))
    is_fraud = rng.binomial(1, np.clip(fraud_prob, 0.002, 0.9))

    df = pd.DataFrame({
        "transaction_id": [f"TXN{500000+i}" for i in range(n)],
        "amount": amount.round(2),
        "hour": hour,
        "is_night": is_night,
        "merchant_risk_score": merchant_risk_score.round(4),
        "distance_from_home_km": distance_from_home_km.round(2),
        "txns_last_24h": txns_last_24h,
        "is_new_device": is_new_device,
        "is_new_merchant": is_new_merchant,
        "card_present": card_present,
        "velocity_amount_24h": velocity_amount_24h.round(2),
        "is_fraud": is_fraud,
    })
    return df


if __name__ == "__main__":
    applicants = generate_credit_applicants()
    transactions = generate_transactions()
    applicants.to_csv("data_applicants.csv", index=False)
    transactions.to_csv("data_transactions.csv", index=False)
    print(f"Applicants: {applicants.shape}, default rate={applicants.defaulted.mean():.3f}")
    print(f"Transactions: {transactions.shape}, fraud rate={transactions.is_fraud.mean():.3f}")
