import { createContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../api/types";
import { setAuthToken } from "../api/axios";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loginSuccess: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("tm_token"));
  const [user, setUser]   = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("tm_user") || "null")
  );

  useEffect(() => { setAuthToken(token); }, [token]);

  const value = useMemo(() => ({
    user, token,
    loginSuccess: (tk: string, u: AuthUser) => {
      setToken(tk); setUser(u);
      localStorage.setItem("tm_token", tk);
      localStorage.setItem("tm_user", JSON.stringify(u));
    },
    logout: () => {
      setToken(null); setUser(null);
      localStorage.removeItem("tm_token");
      localStorage.removeItem("tm_user");
    }
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
