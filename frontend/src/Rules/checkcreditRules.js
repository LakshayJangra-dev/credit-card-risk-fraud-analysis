import { CREDIT_RULES } from "./creditrules";

export function checkCreditRules(values) {
  const reasons = [];

  if (
    values.age < CREDIT_RULES.minAge ||
    values.age > CREDIT_RULES.maxAge
  ) {
    reasons.push(
      `Applicant age must be between ${CREDIT_RULES.minAge} and ${CREDIT_RULES.maxAge}.`
    );
  }

  if (values.annual_income < CREDIT_RULES.minAnnualIncome) {
    reasons.push(
      `Annual income must be at least ₹${CREDIT_RULES.minAnnualIncome.toLocaleString()}.`
    );
  }

  if (values.employment_years < CREDIT_RULES.minEmploymentYears) {
    reasons.push(
      `Employment history must be at least ${CREDIT_RULES.minEmploymentYears} year.`
    );
  }

  if (values.debt_to_income > CREDIT_RULES.maxDebtToIncome) {
    reasons.push(
      `Debt-to-income ratio cannot exceed ${CREDIT_RULES.maxDebtToIncome}.`
    );
  }

  if (
    values.credit_history_years <
    CREDIT_RULES.minCreditHistoryYears
  ) {
    reasons.push(
      `Credit history must be at least ${CREDIT_RULES.minCreditHistoryYears} year.`
    );
  }

  if (
    values.num_late_payments_2y >
    CREDIT_RULES.maxLatePayments2Y
  ) {
    reasons.push(
      `Late payments in the last 2 years cannot exceed ${CREDIT_RULES.maxLatePayments2Y}.`
    );
  }

  if (values.loan_to_income > CREDIT_RULES.maxLoanToIncome) {
    reasons.push(
      `Loan-to-income ratio cannot exceed ${CREDIT_RULES.maxLoanToIncome}.`
    );
  }

  if (
    values.recent_credit_inquiries >
    CREDIT_RULES.maxRecentCreditInquiries
  ) {
    reasons.push(
      `Recent credit inquiries cannot exceed ${CREDIT_RULES.maxRecentCreditInquiries}.`
    );
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}