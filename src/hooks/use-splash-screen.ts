import { useState, useEffect } from "react";

interface UseSplashScreenOptions {
  duration?: number;
  minDuration?: number;
  autoHide?: boolean;
}

export function useSplashScreen({
  duration = 2000,
  minDuration = 1000,
  autoHide = true
}: UseSplashScreenOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  const hideSplash = () => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDuration - elapsed);
    
    setTimeout(() => {
      setIsLoading(false);
    }, remainingTime);
  };

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        hideSplash();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, autoHide]);

  return {
    isLoading,
    hideSplash,
    setIsLoading
  };
}
