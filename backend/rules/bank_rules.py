class BankEligibilityRules:

    MIN_ANNUAL_INCOME = 25000
    MAX_ANNUAL_INCOME = 1000000
    MIN_AGE = 18
    MAX_AGE = 70
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

        # Age
        if age < cls.MIN_AGE:
            violations.append(
                f"Minimum age is {cls.MIN_AGE} years."
            )

        if age > cls.MAX_AGE:
            violations.append(
                f"Maximum age is {cls.MAX_AGE} years."
            )

        # Income
        if annual_income < cls.MIN_ANNUAL_INCOME:
            violations.append(
                f"Annual income must be at least {cls.MIN_ANNUAL_INCOME}."
            )

        # Employment
        if employment_years < cls.MIN_EMPLOYMENT_YEARS:
            violations.append(
                "Employment years cannot be negative."
            )

        # Debt-to-income
        if debt_to_income > cls.MAX_DEBT_TO_INCOME:
            violations.append(
                f"Debt-to-income ratio cannot exceed {cls.MAX_DEBT_TO_INCOME:.0%}."
            )

        # Loan-to-income
        if loan_to_income > cls.MAX_LOAN_TO_INCOME:
            violations.append(
                f"Loan-to-income ratio cannot exceed {cls.MAX_LOAN_TO_INCOME:.0%}."
            )

        return {
            "eligible": len(violations) == 0,
            "violations": violations
        }