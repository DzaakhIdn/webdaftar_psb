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
  duration = 1500 
}: SplashScreenMinimalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;

    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    // Initial state
    gsap.set(content, { opacity: 0, scale: 0.8 });

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }
    });

    // Entrance animation
    tl.to(content, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Hold for duration
    tl.to({}, { duration: duration / 1000 });

  }, [loading, onComplete, duration]);

  if (!loading) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        zIndex: 9999,
      }}
    >
      <div ref={contentRef}>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          {/* Simple Logo */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              mx: "auto",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
              }}
            >
              D
            </Typography>
          </Box>

          {/* App Name */}
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Typography>
        </Box>
      </div>
    </Box>
  );
}
