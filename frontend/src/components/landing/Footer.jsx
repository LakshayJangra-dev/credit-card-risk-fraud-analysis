import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Footer({ onOpenModal }) {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-[#1E2633] py-12 px-6 bg-[#07090D]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-display font-bold text-white text-base">DigitalWall Risk Engine</span>
          <span className="text-xs text-[#8A93A6]">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#8A93A6]">
          <button onClick={() => onOpenModal("docs")} className="hover:text-white transition-colors">
            API Documentation
          </button>
          <button onClick={() => onOpenModal("security")} className="hover:text-white transition-colors">
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
  );
}
