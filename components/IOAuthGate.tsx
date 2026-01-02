"use client";

import { useState, useEffect, ReactNode } from "react";

const CORRECT_PASSWORD = "jenn.io";
const AUTH_KEY = "jenn-io-auth";

interface IOAuthGateProps {
  children: ReactNode;
}

export default function IOAuthGate({ children }: IOAuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check localStorage on mount
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === "true");
  }, []);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      setError("");
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Loading state - prevent flash
  if (isAuthenticated === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#2F2F2C" }}
      >
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#97A97C", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Password gate
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#2F2F2C" }}
      >
        <div className="text-center">
          <h1
            className="text-3xl mb-2 italic"
            style={{ color: "#FFF5EB", fontFamily: "var(--font-instrument)" }}
          >
            Jenn&apos;s IO
          </h1>
          <p className="text-sm mb-8" style={{ color: "#97A97C" }}>
            Backend tools & utilities
          </p>
          <div className="flex flex-col gap-3 items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Password"
              className="px-4 py-3 rounded-lg text-center text-sm outline-none focus:ring-2"
              style={{
                background: "#3C422E",
                color: "#FFF5EB",
                border: "1px solid #546E40",
                width: "200px",
              }}
              autoFocus
            />
            <button
              onClick={handleLogin}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FABF34 0%, #D4A853 100%)",
                color: "#2F2F2C",
              }}
            >
              Enter
            </button>
            {error && (
              <p className="text-sm mt-2" style={{ color: "#FABF34" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}
