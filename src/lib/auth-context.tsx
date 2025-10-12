"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api/config"; // axios instance ที่ชี้ไป backend

interface User {
  id: string;
  username: string;
  role?: "admin" | "staff" | string;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
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

  // 🔹 ตรวจสอบ session ทันทีที่โหลด
  useEffect(() => {
    refreshUser();
  }, []);

  // 🔍 ตรวจสอบ token และดึงข้อมูล user
  const refreshUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get("/v1/auth/me"); // backend endpoint จริง
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 เข้าสู่ระบบ
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/v1/auth/login", { username, password });
      const { token, user } = response.data;

      // เก็บ token และ set state
      localStorage.setItem("token", token);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // 🚪 ออกจากระบบ
  const logout = async () => {
    try {
      await api.post("/v1/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
