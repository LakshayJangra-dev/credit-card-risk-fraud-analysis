import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes checking the JWT
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1217] flex items-center justify-center">
        <div className="text-[#8A93A6] font-mono text-[13px]">
          Checking authentication…
        </div>
      </div>
    );
  }

  // No valid authenticated user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
}