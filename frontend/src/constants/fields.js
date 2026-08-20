export const CREDIT_FIELDS = [
  ["age", "Age", 35],
  ["annual_income", "Annual Income", 72000],
  ["employment_years", "Employment (yrs)", 8],
  ["existing_debt", "Existing Debt", 5000],
  ["credit_history_years", "Credit History (yrs)", 10],
  ["num_late_payments_2y", "Late Payments (2yr)", 0],
  ["debt_to_income", "Debt-to-Income", 0.069],
  ["loan_amount", "Loan Amount", 10000],
  ["loan_to_income", "Loan-to-Income", 0.139],
  ["num_credit_lines", "Credit Lines", 4],
  ["recent_credit_inquiries", "Recent Inquiries", 1],
];

export const FRAUD_FIELDS = [
  ["amount", "Amount", 120],
  ["hour", "Hour (0-23)", 14],
  ["is_night", "Is Night (0/1)", 0],
  ["merchant_risk_score", "Merchant Risk (0-1)", 0.1],
  ["distance_from_home_km", "Distance (km)", 5],
  ["txns_last_24h", "Txns Last 24h", 2],
  ["is_new_device", "New Device (0/1)", 0],
  ["is_new_merchant", "New Merchant (0/1)", 0],
  ["card_present", "Card Present (0/1)", 1],
  ["velocity_amount_24h", "Velocity Amount 24h", 300],
];

export const SAMPLE_TRANSACTIONS = [
  {
    amount: 45, hour: 14, is_night: 0, merchant_risk_score: 0.05, distance_from_home_km: 3,
    txns_last_24h: 2, is_new_device: 0, is_new_merchant: 0, card_present: 1, velocity_amount_24h: 120,
  },
  {
    amount: 890, hour: 3, is_night: 1, merchant_risk_score: 0.72, distance_from_home_km: 210,
    txns_last_24h: 7, is_new_device: 1, is_new_merchant: 1, card_present: 0, velocity_amount_24h: 3200,
  },
];

export function defaultValues(fields) {
  return Object.fromEntries(fields.map(([key, , def]) => [key, def]));
}
