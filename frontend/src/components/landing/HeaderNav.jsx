import React from "react";
import { Link } from "react-router-dom";
import { Shield, User, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function HeaderNav({ onOpenModal }) {
  const { user, isAuthenticated } = useAuth();

  return (
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
            DigitalWall <span className="badge-purple">Risk AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-[#8A93A6]">
          <button onClick={() => onOpenModal("company")} className="hover:text-white transition-colors">
            Company
          </button>
          <button onClick={() => onOpenModal("docs")} className="hover:text-white transition-colors">
            Docs
          </button>
          <button onClick={() => onOpenModal("pricing")} className="hover:text-white transition-colors">
            Pricing
          </button>
          <button onClick={() => onOpenModal("security")} className="hover:text-white transition-colors">
            Security
          </button>
          <button onClick={() => onOpenModal("contacts")} className="hover:text-white transition-colors">
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
                className="btn-gradient-purple px-4 py-2 text-[13px] flex items-center gap-2"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-dark-outline px-4 py-2 text-[13.5px]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-[13.5px] font-semibold text-[#0A0D12] bg-white hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
