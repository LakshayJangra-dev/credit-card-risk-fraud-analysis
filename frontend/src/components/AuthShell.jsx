import React from "react";

/**
 * AuthShell
 * ----------
 * Shared chrome for Login and Signup: brand mark, ambient glow background,
 * heading, and footer disclaimer. Keeps the two pages visually identical
 * outside of their form content.
 */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0E1217] px-6 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#4C8BF5] opacity-[0.06] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#4C8BF5] to-[#2C5BB5] flex items-center justify-center shadow-lg shadow-[#4C8BF5]/20 mb-4">
            <span className="font-semibold text-white text-sm tracking-tight font-display">RC</span>
          </div>
          <h1 className="text-xl font-semibold text-[#E7EAF0] tracking-tight font-display">{title}</h1>
          <p className="text-[11px] uppercase tracking-[1.5px] text-[#8A93A6] mt-1.5 font-mono">
            {subtitle}
          </p>
        </div>

        {children}

        <p className="text-center text-[10.5px] tracking-wide text-[#4E5766] mt-8 font-mono uppercase">
          Prototype · Synthetic Data · Not For Production Use
        </p>
      </div>
    </div>
  );
}
