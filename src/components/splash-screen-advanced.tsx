"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { gsap } from "gsap";

interface SplashScreenAdvancedProps {
  loading?: boolean;
  onComplete?: () => void;
  duration?: number;
  showProgress?: boolean;
}

export function SplashScreenAdvanced({ 
  loading = true, 
  onComplete, 
  duration = 3000,
  showProgress = true 
}: SplashScreenAdvancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const container = containerRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const progressElement = progressRef.current;

    if (!container || !logo || !text || !progressElement) return;

    // Initial state
    gsap.set([logo, text, progressElement], { opacity: 0, y: 50 });
    gsap.set(dotsRef.current, { scale: 0 });

    // Animation timeline
    const tl = gsap.timeline();

    // Entrance animations
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(text, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(progressElement, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");

    // Animate dots
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        tl.to(dot, {
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)"
        }, `-=${0.4 - index * 0.1}`);
      }
    });

    // Animate dots continuously
    const animateDots = () => {
      dotsRef.current.forEach((dot, index) => {
        if (dot) {
          gsap.to(dot, {
            scale: 1.5,
            duration: 0.4,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
            delay: index * 0.2
          });
        }
      });
    };

    const dotsInterval = setInterval(animateDots, 1500);

    // Progress simulation
    let progressInterval: NodeJS.Timeout;
    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 5;
        });
      }, 100);
    }

    // Complete animation
    const completeTimer = setTimeout(() => {
      if (showProgress) {
        setProgress(100);
      }
      
      setTimeout(() => {
        gsap.to(container, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }, 300);
    }, duration);

    return () => {
      clearInterval(dotsInterval);
      if (progressInterval) clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };

  }, [loading, onComplete, duration, showProgress]);

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)",
        zIndex: 9999,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      {/* Logo */}
      <div ref={logoRef}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "2rem"
            }}
          >
            D
          </Typography>
        </Box>
      </div>

      {/* App Name */}
      <div ref={textRef}>
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: 600,
            mb: 1,
            textAlign: "center",
            fontSize: "1.75rem"
          }}
        >
          Dashboard App
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            mb: 4,
            fontSize: "0.95rem"
          }}
        >
          Loading your workspace...
        </Typography>
      </div>

      <div ref={progressRef}>
        {/* Loading Dots */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: showProgress ? 3 : 0
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              ref={(el) => {
                if (el) dotsRef.current[index] = el;
              }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6"
              }}
            />
          ))}
        </Box>

        {/* Progress Bar */}
        {showProgress && (
          <div ref={progressRef}>
            <Box sx={{ width: 200, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#3b82f6",
                    borderRadius: 2
                  }
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                fontSize: "0.75rem",
                textAlign: "center",
                display: "block"
              }}
            >
              Loading... {Math.round(progress)}%
            </Typography>
          </div>
        )}
      </div>
    </Box>
  );
}
