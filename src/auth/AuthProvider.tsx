import { createContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../api/types";
import { setAuthToken } from "../api/axios";
import { isTokenValid } from "./jwt";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loginSuccess: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser]   = useState<AuthUser | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const savedToken = localStorage.getItem("tm_token");
    const savedUser  = localStorage.getItem("tm_user");

    if (savedToken && isTokenValid(savedToken)) {
      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setAuthToken(savedToken);
    } else {
      localStorage.removeItem("tm_token");
      localStorage.removeItem("tm_user");
      setToken(null);
      setUser(null);
      setAuthToken(null);
    }
  }, []);

  useEffect(() => { setAuthToken(token); }, [token]);

  const loginSuccess = (tk: string, u: AuthUser) => {
    setToken(tk);
    setUser(u);
    localStorage.setItem("tm_token", tk);
    localStorage.setItem("tm_user", JSON.stringify(u));
    setAuthToken(tk);
    qc.clear();
  };

    const channel = new BroadcastChannel("auth");

    const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    setAuthToken(null);
    qc.clear();
    channel.postMessage({ type: "logout" }); // ✅ só quando o usuário realmente sair
    };

    useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
        if (ev.data?.type === "logout") {
        setToken(null); setUser(null); setAuthToken(null); qc.clear();
        }
    };
    channel.addEventListener("message", onMsg);
    return () => channel.removeEventListener("message", onMsg);
  }, [qc]);

  channel.postMessage({ type: "logout" });

  const isAuthenticated = useMemo(() => isTokenValid(token), [token]);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, loginSuccess, logout }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
