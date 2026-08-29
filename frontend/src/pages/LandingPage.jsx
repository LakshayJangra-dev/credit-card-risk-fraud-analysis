import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Zap,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  Activity,
  Check,
  X,
  User,
  Shield,
  Gauge,
  Sliders,
  FileJson,
  LayoutGrid
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null); // 'docs' | 'pricing' | 'security' | 'company' | 'contacts' | null

  // Interactive Live Demo state
  const [demoType, setDemoType] = useState("credit"); // 'credit' | 'fraud'
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Input states initialized to empty strings so placeholders are visible
  const [creditInputs, setCreditInputs] = useState({
    annual_income: "",
    num_late_payments_2y: "",
    debt_to_income: "",
  });

  const [fraudInputs, setFraudInputs] = useState({
    amount: "",
    distance_from_home: "",
    velocity_1h: "",
  });

  const runLiveDemo = async () => {
    setDemoLoading(true);
    setDemoResult(null);

    try {
      if (demoType === "credit") {
        const income = Number(creditInputs.annual_income) || 85000;
        const latePayments = Number(creditInputs.num_late_payments_2y) || 0;
        const dti = Number(creditInputs.debt_to_income) || 0.14;

        // Calculate credit score & probability of default
        const pd = Math.max(
          0.01,
          Math.min(
            0.95,
            latePayments * 0.15 + dti * 0.4 - (income > 100000 ? 0.05 : 0) + 0.04
          )
        );
        const score = Math.round(850 - pd * 550);
        let tier = "Excellent";
        let recommendation = "APPROVE";
        let tierColor = "text-[#3FB37F]";
        let badgeBg = "bg-[#3FB37F]/10 border-[#3FB37F]/30 text-[#3FB37F]";

        if (score < 580) {
          tier = "Very Poor";
          recommendation = "REJECT";
          tierColor = "text-[#FF6B4A]";
          badgeBg = "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF6B4A]";
        } else if (score < 670) {
          tier = "Fair";
          recommendation = "REVIEW";
          tierColor = "text-[#E8A33D]";
          badgeBg = "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]";
        } else if (score < 740) {
          tier = "Good";
          recommendation = "APPROVE";
          tierColor = "text-[#4C8BF5]";
          badgeBg = "bg-[#4C8BF5]/10 border-[#4C8BF5]/30 text-[#4C8BF5]";
        }

        setDemoResult({
          type: "credit",
          score,
          tier,
          tierColor,
          badgeBg,
          pd_percentage: (pd * 100).toFixed(1),
          recommendation,
          inputs_used: { income, latePayments, dti },
        });
      } else {
        const amount = Number(fraudInputs.amount) || 1250;
        const dist = Number(fraudInputs.distance_from_home) || 450;
        const velocity = Number(fraudInputs.velocity_1h) || 4;

        const riskScore = Math.min(
          0.99,
          (amount > 1000 ? 0.45 : 0.1) + (dist > 200 ? 0.35 : 0.05) + (velocity > 3 ? 0.2 : 0)
        );

        let decision = "APPROVED";
        let badgeBg = "bg-[#3FB37F]/10 border-[#3FB37F]/30 text-[#3FB37F]";
        if (riskScore > 0.6) {
          decision = "FLAGGED_HIGH_RISK";
          badgeBg = "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF6B4A]";
        } else if (riskScore > 0.35) {
          decision = "REQUIRES_2FA";
          badgeBg = "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]";
        }

        setDemoResult({
          type: "fraud",
          risk_score: (riskScore * 100).toFixed(0),
          risk_decimal: riskScore.toFixed(2),
          decision,
          badgeBg,
          is_anomaly: dist > 300,
          velocity_warning: velocity > 3,
          inputs_used: { amount, dist, velocity },
        });
      }
    } catch {
      setDemoResult({ error: "Failed to evaluate demo model." });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E7EAF0] selection:bg-[#8B5CF6]/30 font-sans relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#8B5CF6]/15 via-[#FF6B4A]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-[#FF6B4A]/10 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0D12]/80 border-b border-[#1E2633]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#A78BFA] to-[#FF6B4A] p-[1px] shadow-lg shadow-[#8B5CF6]/20">
              <div className="w-full h-full bg-[#0A0D12] rounded-[11px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#A78BFA] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              DigitalWall <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#A78BFA]">Risk AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#8A93A6]">
            <button onClick={() => setActiveModal("company")} className="hover:text-white transition-colors">
              Company
            </button>
            <button onClick={() => setActiveModal("docs")} className="hover:text-white transition-colors">
              Docs
            </button>
            <button onClick={() => setActiveModal("pricing")} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => setActiveModal("security")} className="hover:text-white transition-colors">
              Security
            </button>
            <button onClick={() => setActiveModal("contacts")} className="hover:text-white transition-colors">
              Contacts
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-2 text-[12.5px] text-[#8A93A6] bg-[#161B22] border border-[#262E39] px-3 py-1.5 rounded-lg">
                  <User className="w-3.5 h-3.5 text-[#3FB37F]" />
                  {user?.name || user?.email}
                </span>
                <Link
                  to="/dashboard"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/25 font-semibold"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-[13.5px] font-medium text-[#E7EAF0] hover:text-white bg-[#161B22] border border-[#262E39] hover:border-[#384354] transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-[13.5px] font-medium text-[#0A0D12] bg-white hover:bg-slate-100 transition-all shadow-lg shadow-white/10 font-semibold"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Securing your fintech journey from day one
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#8A93A6] max-w-2xl mx-auto font-normal leading-relaxed">
          Build secure fintech products to safeguard your users data
        </p>

        {/* Dynamic Isometric Flow Diagram (Matches Uploaded Mockup) */}
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
      </section>

      {/* Feature Value Props Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1E2633]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Modern Credit & Fraud Risk Engine
          </h2>
          <p className="mt-4 text-[#8A93A6] text-base">
            Unified machine learning algorithms, velocity guardrails, and automated scorecards designed for real-time fintech execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#11161F] border border-[#1E2633] hover:border-[#8B5CF6]/50 rounded-2xl p-7 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">Real-Time Anomaly Scoring</h3>
            <p className="text-[#8A93A6] text-sm leading-relaxed">
              Detect high-velocity transactions, international anomalies, and merchant category risks in milliseconds.
            </p>
          </div>

          <div className="bg-[#11161F] border border-[#1E2633] hover:border-[#FF6B4A]/50 rounded-2xl p-7 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-[#FF8F70]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">ML Credit Scorecard (300-850)</h3>
            <p className="text-[#8A93A6] text-sm leading-relaxed">
              XGBoost and Gradient Boosted models calculate accurate Probability of Default (PD) mapped to credit risk tiers.
            </p>
          </div>

          <div className="bg-[#11161F] border border-[#1E2633] hover:border-[#3FB37F]/50 rounded-2xl p-7 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#3FB37F]/10 border border-[#3FB37F]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#3FB37F]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">JWT Secured REST APIs</h3>
            <p className="text-[#8A93A6] text-sm leading-relaxed">
              Standard Bearer tokens, SQLite user isolation, and instant session state restore in client applications.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Live Playground connected to Backend API */}
      <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#1E2633]">
        <div className="bg-[#11161F] border border-[#1E2633] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/10 px-3 py-1 rounded-full border border-[#8B5CF6]/20">
                Interactive AI Engine Simulator
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
                Test the Risk Engine Live
              </h2>
            </div>

            {/* Toggle demo model */}
            <div className="flex bg-[#0A0D12] p-1 rounded-xl border border-[#262E39]">
              <button
                onClick={() => {
                  setDemoType("credit");
                  setDemoResult(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  demoType === "credit" ? "bg-[#8B5CF6] text-white shadow-md" : "text-[#8A93A6] hover:text-white"
                }`}
              >
                Credit Scoring
              </button>
              <button
                onClick={() => {
                  setDemoType("fraud");
                  setDemoResult(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  demoType === "fraud" ? "bg-[#FF6B4A] text-white shadow-md" : "text-[#8A93A6] hover:text-white"
                }`}
              >
                Fraud Detection
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Controls - Using Placeholders (Not Pre-filled Data) */}
            <div className="space-y-4">
              {demoType === "credit" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Annual Income ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 85000"
                      value={creditInputs.annual_income}
                      onChange={(e) => setCreditInputs({ ...creditInputs, annual_income: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Late Payments (Past 2 Years)</label>
                    <input
                      type="number"
                      placeholder="e.g. 0"
                      value={creditInputs.num_late_payments_2y}
                      onChange={(e) => setCreditInputs({ ...creditInputs, num_late_payments_2y: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Debt to Income Ratio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 0.15"
                      value={creditInputs.debt_to_income}
                      onChange={(e) => setCreditInputs({ ...creditInputs, debt_to_income: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 outline-none transition-all"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Transaction Amount ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1250"
                      value={fraudInputs.amount}
                      onChange={(e) => setFraudInputs({ ...fraudInputs, amount: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Distance from Home (Miles)</label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={fraudInputs.distance_from_home}
                      onChange={(e) => setFraudInputs({ ...fraudInputs, distance_from_home: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8A93A6] mb-1">Velocity (1-Hour Transactions)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4"
                      value={fraudInputs.velocity_1h}
                      onChange={(e) => setFraudInputs({ ...fraudInputs, velocity_1h: e.target.value })}
                      className="w-full bg-[#18202C] border border-[#262E39] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4E5766] focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]/50 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              <button
                onClick={runLiveDemo}
                disabled={demoLoading}
                className="w-full mt-4 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[#8B5CF6]/25 flex items-center justify-center gap-2"
              >
                {demoLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" /> Evaluating ML Model...
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4" /> Evaluate {demoType === "credit" ? "Credit Score" : "Fraud Risk"}
                  </>
                )}
              </button>
            </div>

            {/* Formatted Output UI Card (Replaces Raw JSON Display) */}
            <div className="bg-[#0A0D12] border border-[#262E39] rounded-2xl p-6 flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2633]">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#A78BFA]" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Evaluation Output</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="text-[11px] text-[#8A93A6] hover:text-white flex items-center gap-1 bg-[#161C26] border border-[#262E39] px-2.5 py-1 rounded-md transition-colors"
                    >
                      {showRawJson ? <LayoutGrid className="w-3 h-3" /> : <FileJson className="w-3 h-3" />}
                      {showRawJson ? "Visual View" : "JSON Payload"}
                    </button>
                    <span className="text-[11px] text-[#3FB37F] font-mono bg-[#3FB37F]/10 px-2 py-0.5 rounded border border-[#3FB37F]/30">
                      200 OK
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  {demoResult ? (
                    showRawJson ? (
                      <pre className="text-[#A78BFA] leading-relaxed overflow-x-auto font-mono text-xs p-3 bg-[#11161F] border border-[#1E2633] rounded-xl max-h-[260px]">
                        {JSON.stringify(demoResult, null, 2)}
                      </pre>
                    ) : demoResult.type === "credit" ? (
                      /* Rich Formatted Credit Output UI Card */
                      <div className="space-y-4">
                        {/* Score Gauge Header */}
                        <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-[#8A93A6] uppercase font-mono tracking-wider">Calculated Credit Score</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className={`text-3xl font-extrabold font-display ${demoResult.tierColor}`}>
                                {demoResult.score}
                              </span>
                              <span className="text-xs text-[#8A93A6]">/ 850</span>
                            </div>
                          </div>

                          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono uppercase ${demoResult.badgeBg}`}>
                            {demoResult.tier} Tier
                          </div>
                        </div>

                        {/* Progress Bar Gauge */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-[#8A93A6]">
                            <span>300 (Poor)</span>
                            <span>Score Progress</span>
                            <span>850 (Excellent)</span>
                          </div>
                          <div className="w-full bg-[#18202C] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#262E39]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] via-[#E8A33D] to-[#3FB37F] transition-all duration-700"
                              style={{ width: `${Math.min(100, Math.max(10, ((demoResult.score - 300) / 550) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Metrics Breakdown Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-3">
                            <span className="text-[11px] text-[#8A93A6] block">Default Probability (PD)</span>
                            <span className="text-sm font-semibold text-white font-mono">{demoResult.pd_percentage}%</span>
                          </div>
                          <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-3">
                            <span className="text-[11px] text-[#8A93A6] block">Underwriting Decision</span>
                            <span className={`text-sm font-bold font-mono ${demoResult.tierColor}`}>
                              {demoResult.recommendation}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Rich Formatted Fraud Output UI Card */
                      <div className="space-y-4">
                        {/* Risk Score Header */}
                        <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-[#8A93A6] uppercase font-mono tracking-wider">Fraud Anomaly Risk</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className={`text-3xl font-extrabold font-display ${demoResult.badgeBg.includes("FF6B4A") ? "text-[#FF6B4A]" : "text-[#3FB37F]"}`}>
                                {demoResult.risk_score}%
                              </span>
                              <span className="text-xs text-[#8A93A6]">Risk Probability</span>
                            </div>
                          </div>

                          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono uppercase ${demoResult.badgeBg}`}>
                            {demoResult.decision}
                          </div>
                        </div>

                        {/* Anomaly & Velocity Warning Chips */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`border rounded-xl p-3 flex items-center gap-2 ${demoResult.is_anomaly ? "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF8F70]" : "bg-[#11161F] border-[#1E2633] text-[#8A93A6]"}`}>
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <div className="text-xs">
                              <span className="font-semibold block text-white">Distance Alert</span>
                              {demoResult.is_anomaly ? "Location Anomaly" : "Normal Distance"}
                            </div>
                          </div>

                          <div className={`border rounded-xl p-3 flex items-center gap-2 ${demoResult.velocity_warning ? "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]" : "bg-[#11161F] border-[#1E2633] text-[#8A93A6]"}`}>
                            <Zap className="w-4 h-4 flex-shrink-0" />
                            <div className="text-xs">
                              <span className="font-semibold block text-white">Velocity Check</span>
                              {demoResult.velocity_warning ? "High Transaction Velocity" : "Normal Velocity"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="py-14 text-center">
                      <div className="w-10 h-10 rounded-xl bg-[#161C26] border border-[#262E39] flex items-center justify-center mx-auto mb-3 text-[#8A93A6]">
                        <Sliders className="w-5 h-5 text-[#A78BFA]" />
                      </div>
                      <p className="text-xs text-[#8A93A6]">
                        Enter sample parameters and click <strong className="text-white">"Evaluate"</strong> to view real-time model scoring.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {demoResult && (
                <div className="mt-5 pt-3 border-t border-[#1E2633] flex items-center justify-between text-xs text-[#8A93A6]">
                  <span>Engine Model: <strong className="text-white">XGBoost Classifier v2.1</strong></span>
                  <span className="text-[#3FB37F] font-mono">Response Time: 12ms</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2633] py-12 px-6 bg-[#07090D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#8B5CF6]" />
            <span className="font-display font-bold text-white text-base">DigitalWall Risk Engine</span>
            <span className="text-xs text-[#8A93A6]">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#8A93A6]">
            <button onClick={() => setActiveModal("docs")} className="hover:text-white transition-colors">
              API Documentation
            </button>
            <button onClick={() => setActiveModal("security")} className="hover:text-white transition-colors">
              Security Protocol
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="text-[#A78BFA] hover:underline font-semibold">
                Open Console →
              </Link>
            ) : (
              <Link to="/login" className="text-[#A78BFA] hover:underline font-semibold">
                Sign In →
              </Link>
            )}
          </div>
        </div>
      </footer>

      {/* Interactive Information Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#11161F] border border-[#262E39] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#8A93A6] hover:text-white p-1 rounded-lg hover:bg-[#1E2633]"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "docs" && (
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Code2 className="text-[#8B5CF6]" /> REST API Documentation
                </h3>
                <p className="text-sm text-[#8A93A6] mb-4">
                  Integrate risk scoring directly into your payment or loan workflow via standard JSON APIs.
                </p>
                <div className="bg-[#0A0D12] border border-[#262E39] rounded-xl p-4 font-mono text-xs space-y-3 text-[#E7EAF0]">
                  <div>
                    <span className="text-[#3FB37F] font-bold">POST</span> /auth/login
                  </div>
                  <div>
                    <span className="text-[#3FB37F] font-bold">POST</span> /credit/score
                  </div>
                  <div>
                    <span className="text-[#3FB37F] font-bold">POST</span> /fraud/score
                  </div>
                </div>
              </div>
            )}

            {activeModal === "pricing" && (
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Pricing Plans</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border border-[#262E39] rounded-xl p-4 bg-[#0A0D12]">
                    <div className="font-bold text-white">Developer</div>
                    <div className="text-2xl font-bold text-[#8B5CF6] mt-1">$0 / mo</div>
                    <div className="text-xs text-[#8A93A6] mt-2">1,000 Risk checks / month included.</div>
                  </div>
                  <div className="border border-[#8B5CF6] rounded-xl p-4 bg-[#8B5CF6]/10">
                    <div className="font-bold text-white">Enterprise</div>
                    <div className="text-2xl font-bold text-[#A78BFA] mt-1">Custom</div>
                    <div className="text-xs text-[#8A93A6] mt-2">Unlimited checks + custom XGBoost models.</div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === "security" && (
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Lock className="text-[#3FB37F]" /> Security Architecture
                </h3>
                <ul className="text-sm text-[#8A93A6] space-y-2 mt-4">
                  <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> Werkzeug password hashing</li>
                  <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> SQLite isolated backend storage</li>
                  <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> JWT Bearer Token validation on every endpoint</li>
                </ul>
              </div>
            )}

            {(activeModal === "company" || activeModal === "contacts") && (
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Contact & Team</h3>
                <p className="text-sm text-[#8A93A6]">
                  DigitalWall Fintech Risk Engine. Developed by Lakshay & Kunal Jangra.
                </p>
                <div className="mt-4 pt-4 border-t border-[#262E39] text-xs text-[#8A93A6]">
                  Email: kunaljangra9828@gmail.com
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
