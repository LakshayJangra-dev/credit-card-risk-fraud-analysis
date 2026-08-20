import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { getHealth } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState("checking"); // checking | online | offline

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((d) => !cancelled && setStatus(d.status === "ok" ? "online" : "offline"))
      .catch(() => !cancelled && setStatus("offline"));
    return () => { cancelled = true; };
  }, []);

  const statusColors = {
    checking: "bg-[#8A93A6]",
    online: "bg-[#3FB37F] shadow-[0_0_6px_#3FB37F]",
    offline: "bg-[#E5484D] shadow-[0_0_6px_#E5484D]",
  };
  const statusText = {
    checking: "Checking models…",
    online: "Models online",
    offline: "Models offline",
  };

  return (
    <header className="flex items-center justify-between flex-wrap gap-3 mb-7">
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-[#4C8BF5] to-[#2C5BB5] flex items-center justify-center">
          <span className="font-display font-bold text-[15px] text-white">RC</span>
        </div>
        <div>
          <h1 className="font-display text-[20px] font-semibold tracking-tight leading-none">Risk Console</h1>
          <p className="font-mono text-[10.5px] tracking-[1.5px] text-[#8A93A6] uppercase mt-1">
            Credit &amp; Fraud Analysis System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-[#8A93A6] bg-[#161B22] border border-[#262E39] px-3 py-1.5 rounded-full">
          <span className={`w-[7px] h-[7px] rounded-full ${statusColors[status]}`} />
          {statusText[status]}
        </div>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 font-mono text-[11px] text-[#8A93A6] hover:text-[#E7EAF0] bg-[#161B22] border border-[#262E39] px-3 py-1.5 rounded-full transition-colors"
            title={`Signed in as ${user.email}`}
          >
            <LogOut size={12} />
            {user.name}
          </button>
        )}
      </div>
    </header>
  );
}
