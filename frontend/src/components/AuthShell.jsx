import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

/**
 * AuthShell
 * ----------
 * Shared chrome for Login and Signup: brand mark, ambient purple glow background,
 * title, and back-to-home navigation. Matches the DigitalWall Landing Page theme.
 */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0D12] text-[#E7EAF0] px-6 py-12 relative overflow-hidden font-sans selection:bg-[#8B5CF6]/30">
      {/* Dynamic Background Glows matching Landing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#8B5CF6]/15 via-[#FF6B4A]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6B4A]/10 blur-[130px] pointer-events-none" />

      {/* Top Navigation Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-[#8A93A6] hover:text-white bg-[#11161F] border border-[#1E2633] px-3.5 py-2 rounded-xl transition-all shadow-md group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className="flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#A78BFA] to-[#FF6B4A] p-[1px] shadow-xl shadow-[#8B5CF6]/30">
              <div className="w-full h-full bg-[#0A0D12] rounded-[15px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#A78BFA] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs font-mono tracking-wider text-[#A78BFA] mt-1.5 uppercase bg-[#8B5CF6]/10 px-3 py-0.5 rounded-full border border-[#8B5CF6]/20">
            {subtitle}
          </p>
        </div>

        {/* Children Form Container */}
        {children}

        {/* Footer info */}
        <p className="text-center text-[11px] tracking-wide text-[#525E73] mt-8 font-mono uppercase">
          DigitalWall Risk AI · SQLite Secured · JWT Session
        </p>
      </div>
    </div>
  );
}
