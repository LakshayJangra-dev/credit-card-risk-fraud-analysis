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
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity
)

from auth.auth import (
    init_db,
    signup_user,
    login_user,
    get_user_by_id
)

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "credit-risk-fraud-analysis-secret-key-2026"

jwt = JWTManager(app)

init_db()

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
@app.route("/auth/signup", methods=["POST"])
def auth_signup():
    payload = request.get_json(force=True)

    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    password = payload.get("password", "")

    if not name:
        return jsonify({"error": "Name is required."}), 400

    if not email:
        return jsonify({"error": "Email is required."}), 400

    if not password:
        return jsonify({"error": "Password is required."}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters."
        }), 400

    try:
        user = signup_user(name, email, password)
        return jsonify(user), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    
    
@app.route("/auth/login", methods=["POST"])
def auth_login():
    payload = request.get_json(force=True)

    email = payload.get("email", "").strip()
    password = payload.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    try:
        user = login_user(email, password)
        return jsonify(user)

    except ValueError as e:
        return jsonify({"error": str(e)}), 401
@app.route("/auth/me", methods=["GET"])
@jwt_required()
def auth_me():
    user_id = get_jwt_identity()

    user = get_user_by_id(user_id)

    if user is None:
        return jsonify({
            "error": "User not found."
        }), 404

    return jsonify(user)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok" if MODELS_READY else "models_not_trained",
        "hint": None if MODELS_READY else "Run `python3 train_and_demo.py` first to train and save models.",
    })


@app.route("/credit/score", methods=["POST"])
@jwt_required()
def credit_score():
    if not MODELS_READY:
        return jsonify({"error": "Models not trained yet. Run train_and_demo.py first."}), 503
    payload = request.get_json(force=True)
    missing = _missing_fields(payload, CREDIT_FEATURES)
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    return jsonify(engine.evaluate_application(payload))


@app.route("/fraud/score", methods=["POST"])
@jwt_required()
def fraud_score():
    if not MODELS_READY:
        return jsonify({"error": "Models not trained yet. Run train_and_demo.py first."}), 503
    payload = request.get_json(force=True)
    missing = _missing_fields(payload, FRAUD_FEATURES)
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    return jsonify(engine.evaluate_transaction(payload))


@app.route("/combined/score", methods=["POST"])
@jwt_required()
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

@app.route("/")
def home():
    return "Credit Fraud Risk API is running!"
if __name__ == "__main__":
    if not MODELS_READY:
        print("WARNING: models not found. Run `python3 train_and_demo.py` first, then restart this API.")
    app.run(host="0.0.0.0", port=5000, debug=False)
    