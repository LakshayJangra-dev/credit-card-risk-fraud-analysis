# Automated AI System for Credit Risk & Fraud Analysis

An end-to-end prototype combining two ML models — **credit risk scoring** (probability
of default) and **fraud detection** (real-time transaction risk) — under a single
decision engine, with a REST API on top.

## Architecture (bottom → top)

```
┌─────────────────────────────────────────────────────────┐
│  api.py            REST API (Flask)                     │
│                     /credit/score  /fraud/score  /combined/score
├─────────────────────────────────────────────────────────┤
│  risk_engine.py     RiskEngine                            │
│                     - evaluate_application()  (credit)   │
│                     - evaluate_transaction()  (fraud)    │
│                     - evaluate_combined()     (both)     │
├───────────────────────┬───────────────────────────────────┤
│ credit_risk_model.py   │  fraud_detection_model.py         │
│ XGBoost classifier     │  XGBoost classifier                │
│ -> Probability of      │  + Isolation Forest (anomaly)      │
│    Default (PD)        │  -> blended fraud score            │
│ -> 300-850 score       │  -> ALLOW / STEP_UP / BLOCK         │
├───────────────────────┴───────────────────────────────────┤
│  data_generator.py   Synthetic applicants & transactions   │
└─────────────────────────────────────────────────────────┘
```

**Why two models blended, not one:** credit risk and fraud risk are different
problems (repayment behavior vs. identity/transaction anomalies) with different
data, timeframes (weeks/years vs. milliseconds), and label rarity. The
`RiskEngine` is the layer that reconciles them — e.g. an applicant with strong
credit history but recent suspicious transaction activity gets pulled from
`APPROVE` to `REVIEW` even though their credit score alone looks fine.

**Why classifier + anomaly detector for fraud:** the supervised XGBoost model
catches known fraud patterns; Isolation Forest catches statistically unusual
transactions that don't match any previously-seen fraud pattern (helps with
novel fraud typologies). Scores are blended 70/30.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
# 1. Generate data, train both models, save them to disk, run demo scenarios
python3 train_and_demo.py

# 2. Start the API
python3 api.py
```

## API usage

### `POST /credit/score`
```json
{
  "age": 35, "annual_income": 72000, "employment_years": 8, "existing_debt": 5000,
  "credit_history_years": 10, "num_late_payments_2y": 0, "debt_to_income": 0.069,
  "loan_amount": 10000, "loan_to_income": 0.139, "num_credit_lines": 4,
  "recent_credit_inquiries": 1
}
```
→ `{ "probability_of_default": 0.0347, "credit_score": 635, "risk_tier": "Fair", "decision": "REVIEW", "reason": "..." }`

### `POST /fraud/score`
```json
{
  "amount": 1200.0, "hour": 2, "is_night": 1, "merchant_risk_score": 0.6,
  "distance_from_home_km": 500, "txns_last_24h": 5, "is_new_device": 1,
  "is_new_merchant": 1, "card_present": 0, "velocity_amount_24h": 4800
}
```
→ `{ "supervised_score": 0.995, "anomaly_score": 0.677, "blended_score": 0.90, "decision": "BLOCK", "reason": "..." }`

### `POST /combined/score`
```json
{
  "applicant": { ...same fields as /credit/score... },
  "recent_transactions": [ { ...same fields as /fraud/score... }, ... ]
}
```
→ Combined credit + behavioral-fraud view with a single `final_decision`.

## Files

| File | Purpose |
|---|---|
| `data_generator.py` | Synthetic applicant & transaction data with realistic feature correlations |
| `credit_risk_model.py` | PD model + PD→score(300-850)→tier mapping |
| `fraud_detection_model.py` | Supervised + unsupervised fraud scoring |
| `risk_engine.py` | Decision orchestration layer |
| `train_and_demo.py` | Trains & saves both models, runs sample scenarios |
| `api.py` | Flask REST API |

## Notes on productionizing further
- Swap the synthetic data generator for real historical labeled data (loan
  performance data for credit; confirmed fraud/chargeback labels for fraud).
- Add model monitoring (population stability index, feature drift) since both
  domains drift over time (credit cycles, evolving fraud tactics).
- Add explainability (SHAP) per-decision, especially for credit — many
  jurisdictions require adverse-action reason codes for declines.
- Replace Flask dev server with a production WSGI server (gunicorn/uwsgi) and
  add auth, rate limiting, and request logging before real deployment.
