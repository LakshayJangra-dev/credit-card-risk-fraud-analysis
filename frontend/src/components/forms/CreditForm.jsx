import React, { useState } from "react";
import NumberField from "../NumberField";
import { CREDIT_FIELDS, defaultValues } from "../../constants/fields";
import { validateCreditData } from "../../Validation/creditValidation";

export default function CreditForm({ onRun, loading }) {
  const [values, setValues] = useState(defaultValues(CREDIT_FIELDS));
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));

    // Remove frontend input error when user changes the value
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = () => {
    // Only check basic input validity here.
    // Bank eligibility limits are handled by the backend.
    const newErrors = validateCreditData(values);

    setErrors(newErrors);

    // Stop only if the input itself is invalid
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Send valid input to backend.
    // Backend will check bank eligibility rules.
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