import React from "react";

export default function NumberField({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-[11.5px] text-[#8A93A6] mb-1.5 font-medium">{label}</label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full bg-[#1B222B] border border-[#262E39] rounded-md px-2.5 py-2 text-[13px] text-[#E7EAF0] font-mono focus:outline-none focus:border-[#4C8BF5] focus:ring-1 focus:ring-[#4C8BF5]/40 transition-colors"
      />
    </div>
  );
}
