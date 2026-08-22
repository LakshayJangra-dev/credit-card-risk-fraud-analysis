import React, { useState } from "react";
import NumberField from "../NumberField";
import { CREDIT_FIELDS, defaultValues } from "../../constants/fields";

export default function CreditForm({ onRun, loading }) {
  const [values, setValues] = useState(defaultValues(CREDIT_FIELDS));
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));

    // Remove error when user changes the value
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

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

    // Age
    if (age < 18 || age > 100) {
      newErrors.age = "Age must be between 18 and 100.";
    }

    // Income
    if (annual_income <= 0) {
      newErrors.annual_income = "Annual income must be greater than 0.";
    }

    // Employment
    if (employment_years < 0 || employment_years > 60) {
      newErrors.employment_years =
        "Employment years must be between 0 and 60.";
    }

    // Debt
    if (existing_debt < 0) {
      newErrors.existing_debt = "Existing debt cannot be negative.";
    }

    // Credit history
    if (credit_history_years < 0 || credit_history_years > 80) {
      newErrors.credit_history_years =
        "Credit history must be between 0 and 80 years.";
    }

    // Late payments
    if (num_late_payments_2y < 0) {
      newErrors.num_late_payments_2y =
        "Late payments cannot be negative.";
    }

    // Debt-to-income
    if (debt_to_income < 0 || debt_to_income > 1) {
      newErrors.debt_to_income =
        "Debt-to-income must be between 0 and 1.";
    }

    // Loan amount
    if (loan_amount <= 0) {
      newErrors.loan_amount =
        "Loan amount must be greater than 0.";
    }

    // Loan-to-income
    if (loan_to_income < 0 || loan_to_income > 1) {
      newErrors.loan_to_income =
        "Loan-to-income must be between 0 and 1.";
    }

    // Credit lines
    if (num_credit_lines < 0 || num_credit_lines > 100) {
      newErrors.num_credit_lines =
        "Credit lines must be between 0 and 100.";
    }

    // Recent inquiries
    if (recent_credit_inquiries < 0 || recent_credit_inquiries > 50) {
      newErrors.recent_credit_inquiries =
        "Recent inquiries must be between 0 and 50.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Only send data to ML model if validation passes
    onRun(values);
  };

  return (
    <div>
      <h2 className="font-display text-[14px] font-semibold mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-[5px] bg-[#1B222B] border border-[#262E39] flex items-center justify-center font-mono text-[10px] text-[#8A93A6]">
          1
        </span>
        Applicant Details
      </h2>

      <div className="grid grid-cols-2 gap-x-3">
        {CREDIT_FIELDS.map(([key, label]) => (
          <div key={key} className="mb-3">
            <NumberField
              label={label}
              value={values[key]}
              onChange={(v) => setField(key, v)}
            />

            {errors[key] && (
              <p className="text-red-400 text-[11px] mt-1">
                ❌ {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#4C8BF5] hover:bg-[#2C5BB5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-semibold text-[13.5px] rounded-[7px] py-3 transition-colors mt-1"
      >
        {loading ? "Scoring…" : "Run Credit Assessment"}
      </button>
    </div>
  );
}