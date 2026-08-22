export function validateCreditData(values) {
  const errors = {};

  const {
    age,
    annual_income,
    employment_years,
    existing_debt,
    credit_history_years,
    num_late_payments_2y,
    debt_to_income,
    loan_amount,
    loan_to_income,
    num_credit_lines,
    recent_credit_inquiries,
  } = values;

  if (age < 18 || age > 100) {
    errors.age = "Age must be between 18 and 100.";
  }

  if (annual_income <= 0) {
    errors.annual_income = "Annual income must be greater than 0.";
  }

  if (employment_years < 0 || employment_years > 60) {
    errors.employment_years =
      "Employment years must be between 0 and 60.";
  }

  if (existing_debt < 0) {
    errors.existing_debt =
      "Existing debt cannot be negative.";
  }

  if (credit_history_years < 0 || credit_history_years > 80) {
    errors.credit_history_years =
      "Credit history must be between 0 and 80 years.";
  }

  if (num_late_payments_2y < 0) {
    errors.num_late_payments_2y =
      "Late payments cannot be negative.";
  }

  if (debt_to_income < 0 || debt_to_income > 1) {
    errors.debt_to_income =
      "Debt-to-income must be between 0 and 1.";
  }

  if (loan_amount <= 0) {
    errors.loan_amount =
      "Loan amount must be greater than 0.";
  }

  if (loan_to_income < 0 || loan_to_income > 1) {
    errors.loan_to_income =
      "Loan-to-income must be between 0 and 1.";
  }

  if (num_credit_lines < 0 || num_credit_lines > 100) {
    errors.num_credit_lines =
      "Credit lines must be between 0 and 100.";
  }

  if (recent_credit_inquiries < 0 || recent_credit_inquiries > 50) {
    errors.recent_credit_inquiries =
      "Recent inquiries must be between 0 and 50.";
  }

  return errors;
}