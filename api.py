"""
REST API for the Credit Risk & Fraud Analysis system.

Endpoints:
  POST /credit/score         -> credit risk assessment for a loan applicant
  POST /fraud/score           -> real-time fraud score for a transaction
  POST /combined/score        -> holistic risk view (applicant + recent transactions)
  GET  /health                -> health check

Run with: python3 api.py
Then e.g.: curl -X POST http://localhost:5000/fraud/score -H "Content-Type: application/json" -d '{...}'
"""

from flask import Flask, request, jsonify
from credit_risk_model import CreditRiskModel, FEATURES as CREDIT_FEATURES
from fraud_detection_model import FraudDetectionModel, FEATURES as FRAUD_FEATURES
from risk_engine import RiskEngine
import os

app = Flask(__name__)

credit_model = CreditRiskModel()
fraud_model = FraudDetectionModel()

MODELS_READY = (
    os.path.exists("credit_risk_model.joblib")
    and os.path.exists("fraud_model_classifier.joblib")
    and os.path.exists("fraud_model_anomaly.joblib")
)

if MODELS_READY:
    credit_model.load("credit_risk_model.joblib")
    fraud_model.load("fraud_model")
    engine = RiskEngine(credit_model, fraud_model)
else:
    engine = None


def _missing_fields(payload, required):
    return [f for f in required if f not in payload]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok" if MODELS_READY else "models_not_trained",
        "hint": None if MODELS_READY else "Run `python3 train_and_demo.py` first to train and save models.",
    })


@app.route("/credit/score", methods=["POST"])
def credit_score():
    if not MODELS_READY:
        return jsonify({"error": "Models not trained yet. Run train_and_demo.py first."}), 503
    payload = request.get_json(force=True)
    missing = _missing_fields(payload, CREDIT_FEATURES)
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    return jsonify(engine.evaluate_application(payload))


@app.route("/fraud/score", methods=["POST"])
def fraud_score():
    if not MODELS_READY:
        return jsonify({"error": "Models not trained yet. Run train_and_demo.py first."}), 503
    payload = request.get_json(force=True)
    missing = _missing_fields(payload, FRAUD_FEATURES)
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    return jsonify(engine.evaluate_transaction(payload))


@app.route("/combined/score", methods=["POST"])
def combined_score():
    if not MODELS_READY:
        return jsonify({"error": "Models not trained yet. Run train_and_demo.py first."}), 503
    payload = request.get_json(force=True)
    applicant = payload.get("applicant")
    recent_transactions = payload.get("recent_transactions", [])
    if applicant is None:
        return jsonify({"error": "Payload must include 'applicant' object."}), 400
    missing = _missing_fields(applicant, CREDIT_FEATURES)
    if missing:
        return jsonify({"error": f"Missing applicant fields: {missing}"}), 400
    for i, txn in enumerate(recent_transactions):
        missing_txn = _missing_fields(txn, FRAUD_FEATURES)
        if missing_txn:
            return jsonify({"error": f"Missing fields in recent_transactions[{i}]: {missing_txn}"}), 400
    return jsonify(engine.evaluate_combined(applicant, recent_transactions))

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "project": "Credit Card Risk and Fraud Analysis",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "credit_risk": "/credit/score",
            "fraud_detection": "/fraud/score",
            "combined_analysis": "/combined/score"
        }
    })

if __name__ == "__main__":
    if not MODELS_READY:
        print("WARNING: models not found. Run `python3 train_and_demo.py` first, then restart this API.")
    app.run(host="0.0.0.0", port=5000, debug=False)
