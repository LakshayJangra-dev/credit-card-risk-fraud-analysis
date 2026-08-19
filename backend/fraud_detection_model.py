"""
Fraud Detection Model
----------------------
Combines two complementary signals, as real production fraud stacks typically do:

1. Supervised classifier (XGBoost) trained on labeled historical fraud/non-fraud
   transactions -> captures known fraud patterns.
2. Unsupervised anomaly detector (Isolation Forest) -> flags transactions that look
   statistically unusual even if they don't match previously seen fraud patterns
   (helps catch novel fraud typologies / zero-day attacks).

Final fraud score = weighted blend of both signals.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
from sklearn.ensemble import IsolationForest
from xgboost import XGBClassifier
import joblib

FEATURES = [
    "amount", "hour", "is_night", "merchant_risk_score", "distance_from_home_km",
    "txns_last_24h", "is_new_device", "is_new_merchant", "card_present",
    "velocity_amount_24h",
]


class FraudDetectionModel:
    def __init__(self, supervised_weight=0.7):
        self.supervised_weight = supervised_weight
        self.classifier = XGBClassifier(
            n_estimators=250,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.85,
            eval_metric="auc",
            scale_pos_weight=8,  # fraud is rare -> upweight positive class
            random_state=42,
        )
        self.anomaly_detector = IsolationForest(
            n_estimators=200, contamination=0.05, random_state=42
        )
        self.trained = False

    def fit(self, df: pd.DataFrame, verbose=True):
        X = df[FEATURES]
        y = df["is_fraud"]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        self.classifier.fit(X_train, y_train)
        # Isolation forest trains unsupervised on the (mostly legit) training data
        self.anomaly_detector.fit(X_train)
        self.trained = True

        clf_preds = self.classifier.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, clf_preds)
        if verbose:
            print(f"[Fraud Detection] Supervised classifier Test AUC: {auc:.4f}")
            print(classification_report(y_test, (clf_preds > 0.5).astype(int)))
        return {"auc": auc}

    def _anomaly_score(self, X: pd.DataFrame) -> np.ndarray:
        # decision_function: higher = more normal. Convert to 0-1 "anomalousness".
        raw = self.anomaly_detector.decision_function(X)
        # normalize via logistic squashing centered at 0
        return 1 / (1 + np.exp(raw * 4))

    def predict_fraud_score(self, transaction: dict) -> dict:
        X = pd.DataFrame([transaction])[FEATURES]
        supervised_score = float(self.classifier.predict_proba(X)[:, 1][0])
        anomaly_score = float(self._anomaly_score(X)[0])
        blended = (
            self.supervised_weight * supervised_score
            + (1 - self.supervised_weight) * anomaly_score
        )
        return {
            "supervised_score": supervised_score,
            "anomaly_score": anomaly_score,
            "blended_score": blended,
        }

    def save(self, path_prefix="fraud_model"):
        joblib.dump(self.classifier, f"{path_prefix}_classifier.joblib")
        joblib.dump(self.anomaly_detector, f"{path_prefix}_anomaly.joblib")

    def load(self, path_prefix="fraud_model"):
        self.classifier = joblib.load(f"{path_prefix}_classifier.joblib")
        self.anomaly_detector = joblib.load(f"{path_prefix}_anomaly.joblib")
        self.trained = True

    def feature_importance(self):
        return dict(sorted(
            zip(FEATURES, self.classifier.feature_importances_),
            key=lambda x: -x[1]
        ))
