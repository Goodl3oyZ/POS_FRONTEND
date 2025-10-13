"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api/config";

export interface AppUser {
  id: string;
  username: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: "active" | "inactive" | string;
  roles: string[] | null;
}

// ถ้าอยากให้ชื่อ interface คือ "User" และมีทั้ง user + permissions ตามที่ขอ
export interface User {
  user: AppUser;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/auth/me", { withCredentials: true });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    await api.post(
      "/v1/auth/login",
      { username, password },
      { withCredentials: true }
    );
    await refreshUser();
  };

  const logout = async () => {
    await api.post("/v1/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
