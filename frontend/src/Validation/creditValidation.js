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

  // --------------------------------------------------
  // BASIC INPUT VALIDATION ONLY
  // --------------------------------------------------

  // Age
  if (age === "" || age === null || age === undefined) {
    errors.age = "Age is required.";
  } else if (!Number.isFinite(Number(age))) {
    errors.age = "Age must be a valid number.";
  }

  // Annual Income
  if (
    annual_income === "" ||
    annual_income === null ||
    annual_income === undefined
  ) {
    errors.annual_income = "Annual income is required.";
  } else if (!Number.isFinite(Number(annual_income))) {
    errors.annual_income = "Annual income must be a valid number.";
  }

  // Employment
  if (
    employment_years === "" ||
    employment_years === null ||
    employment_years === undefined
  ) {
    errors.employment_years = "Employment years is required.";
  } else if (!Number.isFinite(Number(employment_years))) {
    errors.employment_years =
      "Employment years must be a valid number.";
  }

  // Existing Debt
  if (
    existing_debt === "" ||
    existing_debt === null ||
    existing_debt === undefined
  ) {
    errors.existing_debt = "Existing debt is required.";
  } else if (!Number.isFinite(Number(existing_debt))) {
    errors.existing_debt =
      "Existing debt must be a valid number.";
  }

  // Credit History
  if (
    credit_history_years === "" ||
    credit_history_years === null ||
    credit_history_years === undefined
  ) {
    errors.credit_history_years =
      "Credit history is required.";
  } else if (!Number.isFinite(Number(credit_history_years))) {
    errors.credit_history_years =
      "Credit history must be a valid number.";
  }

  // Late Payments
  if (
    num_late_payments_2y === "" ||
    num_late_payments_2y === null ||
    num_late_payments_2y === undefined
  ) {
    errors.num_late_payments_2y =
      "Late payments value is required.";
  } else if (!Number.isFinite(Number(num_late_payments_2y))) {
    errors.num_late_payments_2y =
      "Late payments must be a valid number.";
  }

  // Debt-to-Income
  if (
    debt_to_income === "" ||
    debt_to_income === null ||
    debt_to_income === undefined
  ) {
    errors.debt_to_income =
      "Debt-to-income ratio is required.";
  } else if (!Number.isFinite(Number(debt_to_income))) {
    errors.debt_to_income =
      "Debt-to-income must be a valid number.";
  }

  // Loan Amount
  if (
    loan_amount === "" ||
    loan_amount === null ||
    loan_amount === undefined
  ) {
    errors.loan_amount = "Loan amount is required.";
  } else if (!Number.isFinite(Number(loan_amount))) {
    errors.loan_amount =
      "Loan amount must be a valid number.";
  }

  // Loan-to-Income
  if (
    loan_to_income === "" ||
    loan_to_income === null ||
    loan_to_income === undefined
  ) {
    errors.loan_to_income =
      "Loan-to-income ratio is required.";
  } else if (!Number.isFinite(Number(loan_to_income))) {
    errors.loan_to_income =
      "Loan-to-income must be a valid number.";
  }

  // Credit Lines
  if (
    num_credit_lines === "" ||
    num_credit_lines === null ||
    num_credit_lines === undefined
  ) {
    errors.num_credit_lines =
      "Credit lines value is required.";
  } else if (!Number.isFinite(Number(num_credit_lines))) {
    errors.num_credit_lines =
      "Credit lines must be a valid number.";
  }

  // Recent Inquiries
  if (
    recent_credit_inquiries === "" ||
    recent_credit_inquiries === null ||
    recent_credit_inquiries === undefined
  ) {
    errors.recent_credit_inquiries =
      "Recent inquiries value is required.";
  } else if (!Number.isFinite(Number(recent_credit_inquiries))) {
    errors.recent_credit_inquiries =
      "Recent inquiries must be a valid number.";
  }

  return errors;
}