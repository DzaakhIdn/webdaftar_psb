"use client";

import { useState, useEffect } from "react";

// ----------------------------------------------------------------------

interface UseLoadingSimulationOptions {
  delay?: number;
  minLoadingTime?: number;
  autoStart?: boolean;
}

export function useLoadingSimulation({
  delay = 0,
  minLoadingTime = 1000,
  autoStart = true,
}: UseLoadingSimulationOptions = {}) {
  const [isLoading, setIsLoading] = useState(autoStart);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100);
  };

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    
    // Simulate initial delay
    const delayTimer = setTimeout(() => {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const elapsed = Date.now() - startTime - delay;
          const targetProgress = Math.min((elapsed / minLoadingTime) * 100, 95);
          
          if (prev < targetProgress) {
            return Math.min(prev + Math.random() * 10, targetProgress);
          }
          return prev;
        });
      }, 100);

      // Complete loading after minimum time
      const completeTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }, minLoadingTime);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(completeTimer);
      };
    }, delay);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [isLoading, delay, minLoadingTime]);

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
  };
}
