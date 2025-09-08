"use client";

import { useEffect, useState, useCallback } from "react";

export function useCurrentUser(endpoint: string) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        credentials: "include",
        cache: "no-store", // Ensure fresh data
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Function to manually refresh user data
  const refreshUser = useCallback(() => {
    return fetchUser();
  }, [fetchUser]);

  return { user, loading, refreshUser };
}
