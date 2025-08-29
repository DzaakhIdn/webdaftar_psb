"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: string;
  email: string;
  role: string;
  type?: string; // misalnya "dashboard" | "user" | "guest"
};

// 🔹 Map redirect path berdasarkan role + type
const roleRoutes: Record<string, string> = {
  "admin:dashboard": "/dashboard",
  "user:app": "/user/dashboard",
  "guest:app": "/guest/home",
};

type UseAuthOptions = {
  loginEndpoint?: string; // default /api/login
  verifyEndpoint?: string; // default /api/auth/verify
  logoutEndpoint?: string; // default /api/logout
};

export function useAuth(options: UseAuthOptions = {}) {
  const {
    loginEndpoint = "/api/login",
    verifyEndpoint = "/api/auth/verify",
    logoutEndpoint = "/api/logout",
  } = options;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(verifyEndpoint, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Auth verify error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [verifyEndpoint]);

  // 🔹 login function
  const login = useCallback(
    async (
      username: string,
      password: string,
      role?: string,
      type?: string,
      redirectPath?: string
    ) => {
      try {
        const res = await fetch(loginEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role, type }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        setUser(data.user);

        // kalau ada redirectPath manual → pakai itu
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          // bikin key unik berdasarkan role + type
          const key = `${data.user.role}:${data.user.type ?? "app"}`;
          router.push(roleRoutes[key] || "/");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [router, loginEndpoint]
  );

  // 🔹 logout function
  const logout = useCallback(async () => {
    try {
      await fetch(logoutEndpoint, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/"); // default redirect
    }
  }, [router, logoutEndpoint]);

  return { user, loading, login, logout };
}
