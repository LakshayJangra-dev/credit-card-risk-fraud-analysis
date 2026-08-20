import React from "react";

const TONE_COLORS = {
  good: "#3FB37F",
  warn: "#E8A33D",
  bad: "#E5484D",
};

/**
 * Gauge — semicircular instrument-panel dial.
 * fraction: 0..1 fill amount
 * tone: "good" | "warn" | "bad"
 * value: big number shown under the dial
 * label: small mono caption under the value
 */
export default function Gauge({ fraction, tone = "good", value, label }) {
  const cx = 110, cy = 110, r = 90;
  const clamped = Math.max(0, Math.min(1, fraction));
  const startAngle = Math.PI;
  const endAngle = Math.PI - Math.PI * clamped;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = clamped > 0.5 ? 1 : 0;
  const color = TONE_COLORS[tone] || TONE_COLORS.good;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[220px] h-[130px]">
        <svg width="220" height="120" viewBox="0 0 220 120">
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="#262E39"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {clamped > 0 && (
            <path
              d={`M ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
            />
          )}
        </svg>
        <div
          className="absolute bottom-1.5 left-0 right-0 text-center text-[32px] font-bold font-mono"
          style={{ color }}
        >
          {value}
        </div>
      </div>
      <div className="text-[10.5px] uppercase tracking-wide text-[#8A93A6] font-mono mb-4">
        {label}
      </div>
    </div>
  );
}
