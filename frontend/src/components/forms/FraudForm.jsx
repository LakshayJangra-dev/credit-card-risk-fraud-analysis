import React, { useState } from "react";
import NumberField from "../NumberField";
import { FRAUD_FIELDS, defaultValues } from "../../constants/fields";
import { validateFraudData } from "../../validation/fraudValidation";

export default function FraudForm({ onRun, loading }) {
  const [values, setValues] = useState(defaultValues(FRAUD_FIELDS));
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));

    // Remove error for this field when user changes it
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = () => {
    const validationErrors = validateFraudData(values);

    setErrors(validationErrors);

    // Stop here if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Only send valid data to the fraud ML model
    onRun(values);
  };

  return (
    <div>
      <h2 className="font-display text-[14px] font-semibold mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-[5px] bg-[#1B222B] border border-[#262E39] flex items-center justify-center font-mono text-[10px] text-[#8A93A6]">
          1
        </span>
        Transaction Details
      </h2>

      <div className="grid grid-cols-2 gap-x-3">
        {FRAUD_FIELDS.map(([key, label]) => (
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
        {loading ? "Scoring…" : "Run Fraud Check"}
      </button>
    </div>
  );
}