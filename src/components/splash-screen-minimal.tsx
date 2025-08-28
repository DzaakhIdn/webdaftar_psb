"use client";

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { gsap } from "gsap";

interface SplashScreenMinimalProps {
  loading?: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreenMinimal({ 
  loading = true, 
  onComplete, 
  duration = 2000 
}: SplashScreenMinimalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // Initial setup
    gsap.set(contentRef.current, {
      opacity: 0,
      scale: 0.8
    });

    // Entrance animation
    tl.to(contentRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    });

    // Breathing animation
    gsap.to(contentRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Auto complete
    const timer = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete?.();
        }
      });
    }, duration);

    return () => {
      clearTimeout(timer);
      tl.kill();
    };
  }, [loading, onComplete, duration]);

  if (!loading) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        zIndex: 9999
      }}
    >
      <Box
        ref={contentRef}
        sx={{
          textAlign: "center"
        }}
      >
        {/* Simple Logo */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2,
            background: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3
          }}
        >
          <Typography
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#ffffff"
            }}
          >
            D
          </Typography>
        </Box>

        {/* App Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            letterSpacing: "-0.025em"
          }}
        >
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
}
