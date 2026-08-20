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
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Risk Console Access">
      <form onSubmit={handleSubmit} className="bg-[#161B22] border border-[#262E39] rounded-xl p-7 shadow-2xl shadow-black/40">
        {error && (
          <div className="mb-5 text-[12.5px] text-[#E5484D] bg-[#E5484D]/10 border border-[#E5484D]/30 rounded-md px-3 py-2.5">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="block text-[11.5px] font-medium text-[#8A93A6] mb-1.5">Email</span>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full bg-[#1B222B] border border-[#262E39] rounded-md pl-9 pr-3 py-2.5 text-[13px] text-[#E7EAF0] placeholder-[#4E5766] focus:outline-none focus:border-[#4C8BF5] focus:ring-1 focus:ring-[#4C8BF5]/40 transition-colors"
            />
          </div>
        </label>

        <label className="block mb-2">
          <span className="block text-[11.5px] font-medium text-[#8A93A6] mb-1.5">Password</span>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A93A6]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#1B222B] border border-[#262E39] rounded-md pl-9 pr-9 py-2.5 text-[13px] text-[#E7EAF0] placeholder-[#4E5766] focus:outline-none focus:border-[#4C8BF5] focus:ring-1 focus:ring-[#4C8BF5]/40 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A6] hover:text-[#E7EAF0] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </label>

        <div className="flex justify-end mb-6">
          <button type="button" className="text-[11.5px] text-[#4C8BF5] hover:text-[#6FA0F8] transition-colors">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#4C8BF5] hover:bg-[#2C5BB5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13.5px] rounded-md py-2.5 transition-colors font-display"
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
        <Link to="/signup" className="text-[#4C8BF5] hover:text-[#6FA0F8] font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
