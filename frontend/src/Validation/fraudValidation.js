export function validateFraudData(values) {
  const errors = {};

  // Amount
  if (values.amount === "" || values.amount == null || values.amount < 0) {
    errors.amount = "Amount must be 0 or greater.";
  }

  // Hour
  if (
    values.hour === "" ||
    values.hour == null ||
    values.hour < 0 ||
    values.hour > 23
  ) {
    errors.hour = "Hour must be between 0 and 23.";
  }

  // Is Night
  if (![0, 1].includes(Number(values.is_night))) {
    errors.is_night = "Is Night must be either 0 or 1.";
  }

  // Merchant Risk Score
  if (
    values.merchant_risk_score === "" ||
    values.merchant_risk_score == null ||
    values.merchant_risk_score < 0 ||
    values.merchant_risk_score > 1
  ) {
    errors.merchant_risk_score =
      "Merchant Risk Score must be between 0 and 1.";
  }

  // Distance
  if (
    values.distance_from_home_km === "" ||
    values.distance_from_home_km == null ||
    values.distance_from_home_km < 0
  ) {
    errors.distance_from_home_km =
      "Distance cannot be negative.";
  }

  // Transactions in last 24 hours
  if (
    values.txns_last_24h === "" ||
    values.txns_last_24h == null ||
    values.txns_last_24h < 0
  ) {
    errors.txns_last_24h =
      "Transaction count cannot be negative.";
  }

  // New Device
  if (![0, 1].includes(Number(values.is_new_device))) {
    errors.is_new_device =
      "New Device must be either 0 or 1.";
  }

  // New Merchant
  if (![0, 1].includes(Number(values.is_new_merchant))) {
    errors.is_new_merchant =
      "New Merchant must be either 0 or 1.";
  }

  // Card Present
  if (![0, 1].includes(Number(values.card_present))) {
    errors.card_present =
      "Card Present must be either 0 or 1.";
  }

  // Velocity Amount
  if (
    values.velocity_amount_24h === "" ||
    values.velocity_amount_24h == null ||
    values.velocity_amount_24h < 0
  ) {
    errors.velocity_amount_24h =
      "Velocity amount cannot be negative.";
  }

  return errors;
}