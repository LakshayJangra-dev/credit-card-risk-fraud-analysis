import React, { useState } from "react";
import { X } from "lucide-react";
import NumberField from "../NumberField";
import {
  CREDIT_FIELDS,
  SAMPLE_TRANSACTIONS,
  defaultValues,
} from "../../constants/fields";

import { validateCreditData } from "../../validation/creditValidation";
import { validateFraudData } from "../../validation/fraudValidation";

export default function CombinedForm({ onRun, loading }) {
  const [values, setValues] = useState(defaultValues(CREDIT_FIELDS));
  const [recentTxns, setRecentTxns] = useState([]);
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));

    // Clear error when user changes the field
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const addSampleTxn = () => {
    const next =
      SAMPLE_TRANSACTIONS[
        recentTxns.length % SAMPLE_TRANSACTIONS.length
      ];

    setRecentTxns((t) => [...t, next]);

    // Clear transaction error when transaction is added
    setErrors((e) => ({ ...e, transactions: "" }));
  };

  const removeTxn = (i) => {
    setRecentTxns((t) => t.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    // -------------------------------
    // 1. Validate credit information
    // -------------------------------
    const creditErrors = validateCreditData(values);

    // -------------------------------
    // 2. Validate recent transactions
    // -------------------------------
    let transactionErrors = {};

    recentTxns.forEach((transaction, index) => {
      const errorsForTransaction = validateFraudData(transaction);

      if (Object.keys(errorsForTransaction).length > 0) {
        transactionErrors[index] = errorsForTransaction;
      }
    });

    // -------------------------------
    // 3. Combine all validation errors
    // -------------------------------
    const allErrors = {
      ...creditErrors,
    };

    if (Object.keys(transactionErrors).length > 0) {
      allErrors.transactions = transactionErrors;
    }

    setErrors(allErrors);

    // -------------------------------
    // 4. Stop if anything is invalid
    // -------------------------------
    if (Object.keys(allErrors).length > 0) {
      return;
    }

    // -------------------------------
    // 5. Everything is valid
    // -------------------------------
    onRun(values, recentTxns);
  };

  return (
    <div>
      {/* Applicant Details */}
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

      {/* Recent Transactions */}
      <h2 className="font-display text-[14px] font-semibold mt-5 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-[5px] bg-[#1B222B] border border-[#262E39] flex items-center justify-center font-mono text-[10px] text-[#8A93A6]">
          2
        </span>
        Recent Transactions ({recentTxns.length})
      </h2>

      <div className="flex flex-col gap-2 mb-3">
        {recentTxns.length === 0 && (
          <div className="text-[#8A93A6] text-[12px] font-mono">
            No recent transactions added.
          </div>
        )}

        {recentTxns.map((t, i) => (
          <div key={i}>
            <div className="flex items-center justify-between bg-[#1B222B] border border-[#262E39] px-3 py-2 rounded-md font-mono text-[12px]">
              <span>
                ${t.amount} · {t.is_night ? "night" : "day"} ·{" "}
                {t.is_new_device ? "new device" : "known device"}
              </span>

              <button
                onClick={() => removeTxn(i)}
                className="text-[#E5484D] hover:text-[#ff6b6f]"
              >
                <X size={13} />
              </button>
            </div>

            {errors.transactions?.[i] && (
              <div className="text-red-400 text-[11px] mt-1">
                ❌ Invalid transaction data.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Transaction */}
      <button
        onClick={addSampleTxn}
        className="w-full font-mono text-[11.5px] text-[#4C8BF5] hover:bg-[#4C8BF5]/10 border border-dashed border-[#2C5BB5] rounded-md py-2 mb-3.5 transition-colors"
      >
        + Add sample recent transaction
      </button>

      {/* Combined Assessment */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#4C8BF5] hover:bg-[#2C5BB5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-semibold text-[13.5px] rounded-[7px] py-3 transition-colors"
      >
        {loading ? "Scoring…" : "Run Combined Assessment"}
      </button>
    </div>
  );
}