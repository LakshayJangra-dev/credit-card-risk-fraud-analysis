import React from "react";

const TABS = [
  { id: "credit", label: "Credit Application" },
  { id: "fraud", label: "Transaction Check" },
  { id: "combined", label: "Combined View" },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-1.5 mb-5 bg-[#161B22] border border-[#262E39] p-1 rounded-[10px] w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`font-display text-[13px] font-semibold px-4.5 py-2 rounded-[7px] transition-colors ${
            active === tab.id ? "bg-[#4C8BF5] text-white" : "text-[#8A93A6] hover:text-[#E7EAF0]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
