import React, { useState } from "react";
import { X } from "lucide-react";
import NumberField from "../NumberField";
import { CREDIT_FIELDS, SAMPLE_TRANSACTIONS, defaultValues } from "../../constants/fields";

export default function CombinedForm({ onRun, loading }) {
  const [values, setValues] = useState(defaultValues(CREDIT_FIELDS));
  const [recentTxns, setRecentTxns] = useState([]);

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const addSampleTxn = () => {
    const next = SAMPLE_TRANSACTIONS[recentTxns.length % SAMPLE_TRANSACTIONS.length];
    setRecentTxns((t) => [...t, next]);
  };
  const removeTxn = (i) => setRecentTxns((t) => t.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 className="font-display text-[14px] font-semibold mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-[5px] bg-[#1B222B] border border-[#262E39] flex items-center justify-center font-mono text-[10px] text-[#8A93A6]">1</span>
        Applicant Details
      </h2>

      <div className="grid grid-cols-2 gap-x-3">
        {CREDIT_FIELDS.map(([key, label]) => (
          <NumberField key={key} label={label} value={values[key]} onChange={(v) => setField(key, v)} />
        ))}
      </div>

      <h2 className="font-display text-[14px] font-semibold mt-5 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-[5px] bg-[#1B222B] border border-[#262E39] flex items-center justify-center font-mono text-[10px] text-[#8A93A6]">2</span>
        Recent Transactions ({recentTxns.length})
      </h2>

      <div className="flex flex-col gap-2 mb-3">
        {recentTxns.length === 0 && (
          <div className="text-[#8A93A6] text-[12px] font-mono">No recent transactions added.</div>
        )}
        {recentTxns.map((t, i) => (
          <div key={i} className="flex items-center justify-between bg-[#1B222B] border border-[#262E39] px-3 py-2 rounded-md font-mono text-[12px]">
            <span>
              ${t.amount} · {t.is_night ? "night" : "day"} · {t.is_new_device ? "new device" : "known device"}
            </span>
            <button onClick={() => removeTxn(i)} className="text-[#E5484D] hover:text-[#ff6b6f]">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSampleTxn}
        className="w-full font-mono text-[11.5px] text-[#4C8BF5] hover:bg-[#4C8BF5]/10 border border-dashed border-[#2C5BB5] rounded-md py-2 mb-3.5 transition-colors"
      >
        + Add sample recent transaction
      </button>

      <button
        onClick={() => onRun(values, recentTxns)}
        disabled={loading}
        className="w-full bg-[#4C8BF5] hover:bg-[#2C5BB5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-semibold text-[13.5px] rounded-[7px] py-3 transition-colors"
      >
        {loading ? "Scoring…" : "Run Combined Assessment"}
      </button>
    </div>
  );
}
