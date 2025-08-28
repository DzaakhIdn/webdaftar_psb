"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  role: string;
};

const roleRoutes: Record<string, string> = {
  admin: "/dashboard",
  user: "/user/dashboard",// contoh tambahan
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 cek session saat pertama kali load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
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
  }, []);

  // 🔹 login function
  const login = useCallback(
    async (
      username: string,
      password: string,
      role?: string,
      redirectPath?: string
    ) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        setUser(data.user);

        // kalau ada redirectPath manual → pakai itu
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          // kalau tidak ada → pakai mapping role
          router.push(roleRoutes[data.user.role] || "/");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [router]
  );

  // 🔹 logout function
  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/"); // default redirect
    }
  }, [router]);

  return { user, loading, login, logout };
}
