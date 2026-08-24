class BankEligibilityRules:
    MIN_ANNUAL_INCOME = 25000
    MAX_ANNUAL_INCOME = 1000000

    MIN_AGE = 18
    MAX_AGE = 100

    MIN_EMPLOYMENT_YEARS = 0
    MAX_EMPLOYMENT_YEARS = 70

    MAX_DEBT_TO_INCOME = 0.50
    MAX_LOAN_TO_INCOME = 0.60

    @classmethod
    def check(cls, applicant: dict):

        violations = []

        age = applicant.get("age", 0)
        annual_income = applicant.get("annual_income", 0)
        employment_years = applicant.get("employment_years", 0)
        debt_to_income = applicant.get("debt_to_income", 0)
        loan_to_income = applicant.get("loan_to_income", 0)

        # --------------------------------------------------
        # AGE
        # --------------------------------------------------

        if age < cls.MIN_AGE:
            violations.append({
                "field": "age",
                "type": "BELOW_MINIMUM",
                "entered": age,
                "limit": cls.MIN_AGE,
                "message": f"Age must be at least {cls.MIN_AGE} years."
            })

        elif age > cls.MAX_AGE:
            violations.append({
                "field": "age",
                "type": "LIMIT_EXCEEDED",
                "entered": age,
                "limit": cls.MAX_AGE,
                "message": f"Age cannot exceed {cls.MAX_AGE} years."
            })

        # --------------------------------------------------
        # ANNUAL INCOME
        # --------------------------------------------------

        if annual_income < cls.MIN_ANNUAL_INCOME:
            violations.append({
                "field": "annual_income",
                "type": "BELOW_MINIMUM",
                "entered": annual_income,
                "limit": cls.MIN_ANNUAL_INCOME,
                "message": (
                    f"Annual income must be at least "
                    f"{cls.MIN_ANNUAL_INCOME}."
                )
            })

        elif annual_income > cls.MAX_ANNUAL_INCOME:
            violations.append({
                "field": "annual_income",
                "type": "LIMIT_EXCEEDED",
                "entered": annual_income,
                "limit": cls.MAX_ANNUAL_INCOME,
                "message": (
                    f"Annual income cannot exceed "
                    f"{cls.MAX_ANNUAL_INCOME}."
                )
            })

        # --------------------------------------------------
        # EMPLOYMENT
        # --------------------------------------------------

        if employment_years < cls.MIN_EMPLOYMENT_YEARS:
            violations.append({
                "field": "employment_years",
                "type": "BELOW_MINIMUM",
                "entered": employment_years,
                "limit": cls.MIN_EMPLOYMENT_YEARS,
                "message": "Employment years cannot be negative."
            })

        elif employment_years > cls.MAX_EMPLOYMENT_YEARS:
            violations.append({
                "field": "employment_years",
                "type": "LIMIT_EXCEEDED",
                "entered": employment_years,
                "limit": cls.MAX_EMPLOYMENT_YEARS,
                "message": (
                    f"Employment years cannot exceed "
                    f"{cls.MAX_EMPLOYMENT_YEARS} years."
                )
            })

        # --------------------------------------------------
        # DEBT-TO-INCOME
        # --------------------------------------------------

        if debt_to_income < 0:
            violations.append({
                "field": "debt_to_income",
                "type": "INVALID_VALUE",
                "entered": debt_to_income,
                "limit": 0,
                "message": "Debt-to-income ratio cannot be negative."
            })

        elif debt_to_income > cls.MAX_DEBT_TO_INCOME:
            violations.append({
                "field": "debt_to_income",
                "type": "LIMIT_EXCEEDED",
                "entered": debt_to_income,
                "limit": cls.MAX_DEBT_TO_INCOME,
                "message": (
                    f"Debt-to-income ratio cannot exceed "
                    f"{cls.MAX_DEBT_TO_INCOME:.0%}."
                )
            })

        # --------------------------------------------------
        # LOAN-TO-INCOME
        # --------------------------------------------------

        if loan_to_income < 0:
            violations.append({
                "field": "loan_to_income",
                "type": "INVALID_VALUE",
                "entered": loan_to_income,
                "limit": 0,
                "message": "Loan-to-income ratio cannot be negative."
            })

        elif loan_to_income > cls.MAX_LOAN_TO_INCOME:
            violations.append({
                "field": "loan_to_income",
                "type": "LIMIT_EXCEEDED",
                "entered": loan_to_income,
                "limit": cls.MAX_LOAN_TO_INCOME,
                "message": (
                    f"Loan-to-income ratio cannot exceed "
                    f"{cls.MAX_LOAN_TO_INCOME:.0%}."
                )
            })

        # --------------------------------------------------
        # FINAL RESULT
        # --------------------------------------------------

        return {
            "eligible": len(violations) == 0,
            "violations": violations
        }