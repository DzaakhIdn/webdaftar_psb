"use client";

import { useCallback } from "react";
import NProgress from "nprogress";

export function useProgress() {
  const start = useCallback(() => {
    NProgress.start();
  }, []);

  const done = useCallback(() => {
    NProgress.done();
  }, []);

  const set = useCallback((progress: number) => {
    NProgress.set(progress);
  }, []);

  const inc = useCallback((amount?: number) => {
    NProgress.inc(amount);
  }, []);

  // Utility function for async operations with progress
  const withProgress = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      startMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T> => {
    try {
      start();
      const result = await asyncFn();
      done();
      return result;
    } catch (error) {
      done();
      throw error;
    }
  }, [start, done]);

  return {
    start,
    done,
    set,
    inc,
    withProgress,
  };
}
