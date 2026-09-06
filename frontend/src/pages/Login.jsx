import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Risk Console Access">
      <form onSubmit={handleSubmit} className="bg-[#11161F] border border-[#1E2633] rounded-2xl p-7 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {error && (
          <div className="mb-5 text-[12.5px] text-[#FF6B4A] bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="block text-[11.5px] font-medium text-[#8A93A6] mb-1.5">Email</span>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              autoComplete="email"
              className="w-full bg-[#18202C] border border-[#262E39] rounded-xl pl-10 pr-3.5 py-2.5 text-[13px] text-white placeholder-[#4E5766] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all"
            />
          </div>
        </label>

        <label className="block mb-2">
          <span className="block text-[11.5px] font-medium text-[#8A93A6] mb-1.5">Password</span>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#18202C] border border-[#262E39] rounded-xl pl-10 pr-10 py-2.5 text-[13px] text-white placeholder-[#4E5766] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A93A6] hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>

        <div className="flex justify-end mb-6">
          <button type="button" className="text-[11.5px] text-[#A78BFA] hover:text-[#C084FC] transition-colors">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-xl py-3 transition-all shadow-lg shadow-[#8B5CF6]/25 font-display"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <ShieldCheck size={15} />
              Sign in
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[12.5px] text-[#8A93A6] mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#A78BFA] hover:text-[#C084FC] font-semibold transition-colors">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
