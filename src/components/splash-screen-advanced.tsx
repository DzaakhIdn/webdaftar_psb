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

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // Initial setup
    gsap.set([logoRef.current, textRef.current, progressRef.current], {
      opacity: 0,
      y: 30
    });

    gsap.set(dotsRef.current, {
      scale: 0,
      opacity: 0
    });

    // Logo animation with morphing effect
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(logoRef.current, {
      rotationY: 360,
      duration: 1,
      ease: "power2.inOut"
    }, "-=0.4")
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, "-=0.6")
    .to(dotsRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Progress animation
    if (showProgress) {
      tl.to(progressRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5
      }, "-=0.2");

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);

      // Dots pulsing animation
      gsap.to(dotsRef.current, {
        scale: 1.2,
        duration: 0.6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.1
      });

      // Complete after duration
      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        
        setTimeout(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              onComplete?.();
            }
          });
        }, 500);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
        tl.kill();
      };
    }
  }, [loading, onComplete, duration, showProgress]);

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        zIndex: 9999
      }}
    >
      {/* Animated Logo */}
      <Box
        ref={logoRef}
        sx={{
          width: 100,
          height: 100,
          borderRadius: 3,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: "rotate(45deg)",
            animation: "shimmer 2s infinite"
          },
          "@keyframes shimmer": {
            "0%": { transform: "translateX(-100%) translateY(-100%) rotate(45deg)" },
            "100%": { transform: "translateX(100%) translateY(100%) rotate(45deg)" }
          }
        }}
      >
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.05em",
            position: "relative",
            zIndex: 1
          }}
        >
          D
        </Typography>
      </Box>

      {/* App Name */}
      <div ref={textRef}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            mb: 1,
            letterSpacing: "-0.025em",
            fontSize: { xs: "1.75rem", sm: "2rem" }
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            fontSize: "0.95rem",
            textAlign: "center",
            mb: 4,
            fontWeight: 400
          }}
        >
          Modern Analytics Platform
        </Typography>
      </div>

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
    </Box>
  );
}
