"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface NavigationProgressProps {
  height?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  position?: "fixed" | "absolute" | "sticky";
  zIndex?: number;
}

export function NavigationProgress({
  height = 3,
  color = "primary",
  position = "fixed",
  zIndex = 9999,
}: NavigationProgressProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      // Complete after a reasonable time
      completeTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, 800);
    };

    // Start loading on route change
    startLoading();

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position,
            top: 0,
            left: 0,
            right: 0,
            zIndex,
            transformOrigin: "left",
          }}
        >
          <Box
            sx={{
              height,
              width: "100%",
              bgcolor: theme.palette[color].main,
              background: `linear-gradient(90deg, 
                ${theme.palette[color].main} 0%, 
                ${theme.palette[color].light} 50%, 
                ${theme.palette[color].main} 100%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />

          {/* Progress indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${progress}%`,
              bgcolor: theme.palette[color].dark,
              transition: "width 0.2s ease-out",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simplified version with just linear progress
export function SimpleNavigationProgress({
  height = 2,
  color = "primary",
}: {
  height?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height,
          }}
        >
          <LinearProgress
            color={color}
            sx={{
              height: "100%",
              "& .MuiLinearProgress-bar": {
                transition: "transform 0.4s ease-out",
              },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Top loading bar similar to YouTube/GitHub
export function TopLoadingBar({
  height = 3,
  color = "primary",
  style = "gradient",
}: {
  height?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  style?: "solid" | "gradient" | "glow" | "pulse";
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    // Quick initial progress
    const initialTimer = setTimeout(() => setProgress(30), 50);

    // Gradual progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 10;
      });
    }, 150);

    // Complete
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 150);
    }, 500 + Math.random() * 300);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  const getBarStyle = () => {
    const baseColor = theme.palette[color].main;
    const lightColor = theme.palette[color].light;

    switch (style) {
      case "solid":
        return {
          background: baseColor,
        };
      case "gradient":
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
        };
      case "glow":
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
          boxShadow: `0 0 10px ${baseColor}60, 0 0 20px ${baseColor}30`,
        };
      case "pulse":
        return {
          background: baseColor,
          animation: "pulse 1s infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.7 },
          },
        };
      default:
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
        };
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height,
            zIndex: 9999,
            bgcolor: "transparent",
          }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            exit={{ width: "100%" }}
            transition={{
              duration: progress === 100 ? 0.15 : 0.3,
              ease: "easeOut",
            }}
            style={{
              height: "100%",
              ...getBarStyle(),
            }}
          />
        </Box>
      )}
    </AnimatePresence>
  );
}

// Loading bar with text and percentage
export function TopLoadingBarWithText({
  height = 4,
  color = "primary",
  style = "gradient",
  showText = true,
  showPercentage = true,
}: {
  height?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  style?: "solid" | "gradient" | "glow" | "pulse";
  showText?: boolean;
  showPercentage?: boolean;
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading...");

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setLoadingText("Loading...");

    // Quick initial progress
    const initialTimer = setTimeout(() => {
      setProgress(30);
      setLoadingText("Preparing...");
    }, 50);

    // Gradual progress with text updates
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const newProgress = prev + Math.random() * 10;

        // Update text based on progress
        if (newProgress > 70) {
          setLoadingText("Almost done...");
        } else if (newProgress > 40) {
          setLoadingText("Loading content...");
        }

        return newProgress;
      });
    }, 150);

    // Complete
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setLoadingText("Complete!");
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 150);
    }, 500 + Math.random() * 300);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  const getBarStyle = () => {
    const baseColor = theme.palette[color].main;
    const lightColor = theme.palette[color].light;

    switch (style) {
      case "solid":
        return { background: baseColor };
      case "gradient":
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
        };
      case "glow":
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
          boxShadow: `0 0 10px ${baseColor}60, 0 0 20px ${baseColor}30`,
        };
      case "pulse":
        return {
          background: baseColor,
          animation: "pulse 1s infinite",
        };
      default:
        return {
          background: `linear-gradient(90deg, ${baseColor}, ${lightColor})`,
        };
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Progress Bar */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height,
              zIndex: 9999,
              bgcolor: "transparent",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              exit={{ width: "100%" }}
              transition={{
                duration: progress === 100 ? 0.15 : 0.3,
                ease: "easeOut",
              }}
              style={{
                height: "100%",
                ...getBarStyle(),
              }}
            />
          </Box>

          {/* Text and Percentage */}
          {(showText || showPercentage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: height + 8,
                right: 16,
                zIndex: 9999,
                background: theme.palette.background.paper,
                padding: "4px 12px",
                borderRadius: 4,
                boxShadow: theme.shadows[2],
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
              }}
            >
              {showText && loadingText}
              {showText && showPercentage && " - "}
              {showPercentage && `${Math.round(progress)}%`}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
