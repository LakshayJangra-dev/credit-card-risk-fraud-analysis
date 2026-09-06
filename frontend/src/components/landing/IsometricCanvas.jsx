import React from "react";
import { ShieldCheck, AlertTriangle, Activity, Search, Zap } from "lucide-react";

export default function IsometricCanvas() {
  return (
    <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
      <div className="relative w-full aspect-[16/9] max-h-[580px] bg-[#0E131C]/60 border border-[#1E2635] rounded-3xl p-6 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E2635_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Isometric Road Paths Canvas SVG */}
        <svg className="w-full h-full" viewBox="0 0 1000 560" fill="none">
          <defs>
            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF8F70" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track 1: Hacker Transaction */}
          <path
            d="M 50 180 L 250 180 L 320 250 L 150 350 L 50 350"
            stroke="#1F2937"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 180 L 250 180 L 320 250 L 150 350 L 50 350"
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Track 2: Legitimate Transaction */}
          <path
            d="M 50 480 L 280 480 L 450 380 L 380 300 L 200 300"
            stroke="#1B222E"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 480 L 280 480 L 450 380 L 380 300 L 200 300"
            stroke="#4B5563"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Track 3: Transaction Remedied */}
          <path
            d="M 950 120 L 780 120 L 720 220 L 920 220 L 920 320 L 550 420"
            stroke="#6D28D9"
            strokeWidth="30"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowEffect)"
          />
          <path
            d="M 950 120 L 780 120 L 720 220 L 920 220 L 920 320 L 550 420"
            stroke="#A78BFA"
            strokeWidth="4"
            strokeDasharray="10 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Track 4: Threat Detected */}
          <path
            d="M 950 440 L 750 440 L 560 360 L 500 350"
            stroke="#EA580C"
            strokeWidth="28"
            strokeOpacity="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowEffect)"
          />
          <path
            d="M 950 440 L 750 440 L 560 360 L 500 350"
            stroke="#FF8F70"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />

          {/* Animated Pulsing Signal Nodes */}
          <circle r="6" fill="#F43F5E">
            <animateMotion
              path="M 50 180 L 250 180 L 320 250 L 150 350 L 50 350"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="6" fill="#A78BFA">
            <animateMotion
              path="M 950 120 L 780 120 L 720 220 L 920 220 L 920 320 L 550 420"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="6" fill="#FF6B4A">
            <animateMotion
              path="M 950 440 L 750 440 L 560 360"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* Labels on SVG roads */}
        <div className="absolute top-[150px] left-[130px] -rotate-12 flex items-center gap-2 bg-[#11161F]/90 border border-[#2B3545] px-3 py-1 rounded-full text-[11px] font-mono text-[#9CA3AF] shadow-lg">
          <span className="w-5 h-5 rounded-full bg-[#1F2937] flex items-center justify-center text-[10px]">💀</span>
          hacker transaction
        </div>

        <div className="absolute bottom-[70px] left-[110px] rotate-12 flex items-center gap-2 bg-[#11161F]/90 border border-[#2B3545] px-3 py-1 rounded-full text-[11px] font-mono text-[#9CA3AF] shadow-lg">
          <span className="w-5 h-5 rounded-full bg-[#1F2937] flex items-center justify-center text-[10px]">₿</span>
          legitimate transaction
        </div>

        <div className="absolute top-[200px] right-[140px] -rotate-12 flex items-center gap-2 bg-[#1A102F]/90 border border-[#8B5CF6]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#C084FC] shadow-lg shadow-[#8B5CF6]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3FB37F]" />
          transaction remedied
        </div>

        <div className="absolute bottom-[90px] right-[160px] rotate-12 flex items-center gap-2 bg-[#2E1210]/90 border border-[#FF6B4A]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#FF8F70] shadow-lg shadow-[#FF6B4A]/20">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B4A]" />
          threat detected
        </div>

        {/* Central Stacked 3D Isometric Cards */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] flex items-center justify-center pointer-events-none">
          {/* Card 1 Top */}
          <div className="absolute -top-8 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-2xl shadow-[#8B5CF6]/60 rotate-45 flex items-center justify-center border border-white/20 transform hover:scale-105 transition-transform">
            <div className="-rotate-45">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Card 2 Middle */}
          <div className="absolute top-4 w-28 h-28 rounded-2xl bg-[#161C26]/90 border border-[#2B3545] shadow-2xl rotate-45 flex items-center justify-center backdrop-blur-md">
            <div className="-rotate-45">
              <Search className="w-6 h-6 text-[#9CA3AF]" />
            </div>
          </div>

          {/* Card 3 Bottom */}
          <div className="absolute top-16 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#FF8F70] to-[#FF5722] shadow-2xl shadow-[#FF6B4A]/60 rotate-45 flex items-center justify-center border border-white/20">
            <div className="-rotate-45">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
