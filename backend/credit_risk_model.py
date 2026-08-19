"""
Credit Risk Model
------------------
Trains a gradient-boosted classifier to estimate Probability of Default (PD)
for a loan applicant, then maps PD -> a 300-850 style credit score and a
risk tier, similar to how real bureau/lender scorecards are presented.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
from xgboost import XGBClassifier
import joblib

FEATURES = [
    "age", "annual_income", "employment_years", "existing_debt",
    "credit_history_years", "num_late_payments_2y", "debt_to_income",
    "loan_amount", "loan_to_income", "num_credit_lines", "recent_credit_inquiries",
]


class CreditRiskModel:
    def __init__(self):
        self.model = XGBClassifier(
            n_estimators=250,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.85,
            eval_metric="auc",
            random_state=42,
        )
        self.trained = False

    def fit(self, df: pd.DataFrame, verbose=True):
        X = df[FEATURES]
        y = df["defaulted"]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        self.model.fit(X_train, y_train)
        self.trained = True

        preds = self.model.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, preds)
        if verbose:
            print(f"[Credit Risk] Test AUC: {auc:.4f}")
            print(classification_report(y_test, (preds > 0.5).astype(int)))
        return {"auc": auc}

    def predict_pd(self, applicant: dict) -> float:
        """Return probability of default (0-1) for a single applicant dict."""
        X = pd.DataFrame([applicant])[FEATURES]
        return float(self.model.predict_proba(X)[:, 1][0])

    @staticmethod
    def pd_to_score(pd_value: float) -> int:
        """
        Map probability of default to a familiar 300-850 credit-score scale.
        Lower PD -> higher score. Uses a log-odds linear mapping, floored/capped.
        """
        pd_value = min(max(pd_value, 0.0005), 0.9995)
        odds = (1 - pd_value) / pd_value
        score = 300 + 70 * np.log2(odds)  # tuned so ~PD 1% -> ~760, ~PD 10% -> ~520, ~PD 50% -> 300
        return int(np.clip(score, 300, 850))

    @staticmethod
    def score_to_tier(score: int) -> str:
        if score >= 750:
            return "Excellent"
        elif score >= 670:
            return "Good"
        elif score >= 580:
            return "Fair"
        elif score >= 500:
            return "Poor"
        return "Very Poor"

    def save(self, path="credit_risk_model.joblib"):
        joblib.dump(self.model, path)

    def load(self, path="credit_risk_model.joblib"):
        self.model = joblib.load(path)
        self.trained = True

    def feature_importance(self):
        return dict(sorted(
            zip(FEATURES, self.model.feature_importances_),
            key=lambda x: -x[1]
        ))
