"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface SimpleProgressBarProps {
  height?: number;
  color?: string;
}

export function SimpleProgressBar({
  height = 3,
  color = "#3b82f6",
}: SimpleProgressBarProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    const startProgress = () => {
      if (isLoading) return; // Prevent multiple triggers

      // Use requestAnimationFrame to avoid scheduling updates during render
      requestAnimationFrame(() => {
        setIsLoading(true);
        setProgress(0);

        // Simulate realistic compilation progress
        progressTimer = setInterval(() => {
          setProgress((prev) => {
            // Faster initial progress, then slower
            if (prev < 20) return prev + Math.random() * 12;
            if (prev < 50) return prev + Math.random() * 8;
            if (prev < 80) return prev + Math.random() * 5;
            if (prev < 95) return prev + Math.random() * 2;
            return prev; // Stay at ~95% until route actually changes
          });
        }, 120);

        // Fallback: complete after maximum time
        timeoutTimer = setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 300);
        }, 3000); // Max 3 seconds
      });
    };

    // Listen for clicks on navigation elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          if (
            url.origin === window.location.origin &&
            url.pathname !== pathname
          ) {
            startProgress();
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    };

    // Listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      startProgress();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function (...args) {
      startProgress();
      return originalReplaceState.apply(history, args);
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(timeoutTimer);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [pathname]);

  // Complete progress when pathname changes
  useEffect(() => {
    if (isLoading) {
      // Use requestAnimationFrame to avoid scheduling updates during render
      requestAnimationFrame(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      });
    }
  }, [pathname, isLoading]);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        zIndex: 9999,
        background: "rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 10px ${color}60`,
          transition: "width 0.2s ease-out",
        }}
      />
    </div>
  );
}
