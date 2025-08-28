"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string; // "admin" | "user" | dll
}

export function useAuth({
  redirectTo,
  allowedRoles,
}: {
  redirectTo?: string;
  allowedRoles?: string[];
} = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", { credentials: "include" });
        if (!res.ok) {
          if (redirectTo) router.push(redirectTo);
          return;
        }

        const data = await res.json();
        if (allowedRoles && !allowedRoles.includes(data.user.role)) {
          router.push("/unauthorized");
          return;
        }

        setUser(data.user);
      } catch (err) {
        if (redirectTo) router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [redirectTo, allowedRoles, router]);

  return { user, loading, isAuthenticated: !!user };
}
