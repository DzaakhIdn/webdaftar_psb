"use client";

import { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { gsap } from "gsap";
import Image from "next/image";

interface SplashScreenProps {
  loading?: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ 
  loading = true, 
  onComplete, 
  duration = 2000 
}: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }
    });

    // Initial setup
    gsap.set([logoRef.current, textRef.current, progressRef.current], {
      opacity: 0,
      y: 40
    });

    gsap.set(glowRef.current, {
      scale: 0.8,
      opacity: 0
    });

    // Enhanced animation sequence
    tl.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.2,
      duration: 1.2,
      ease: "power2.out"
    })
    .to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.75)",
      rotate: 360
    }, "-=0.8")
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1
    }, "-=0.5")
    .to(progressRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, "-=0.4");

    // Continuous glow animation
    gsap.to(glowRef.current, {
      scale: 1.3,
      opacity: 0.15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Auto complete
    const timer = setTimeout(() => {
      tl.progress(1);
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        zIndex: 9999
      }}
    >
      <Box
        ref={glowRef}
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(29,78,216,0) 70%)",
          filter: "blur(20px)"
        }}
      />

      {/* Logo */}
      <Box
        ref={logoRef}
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          mb: 4,
          filter: "drop-shadow(0 0 20px rgba(59,130,246,0.3))"
        }}
      >
        <Image
          src="/assets/logo.png"
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Box>

      {/* App Name & Description */}
      <div ref={textRef}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#ffffff",
            mb: 1.5,
            letterSpacing: "-0.02em",
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}
        >
          Dashboard Admin
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            textAlign: "center",
            mb: 4,
            maxWidth: "300px",
            lineHeight: 1.5
          }}
        >
          Preparing your experience...
        </Typography>
      </div>

      {/* Enhanced Loading Indicator */}
      <div ref={progressRef}>
        <CircularProgress
          size={40}
          thickness={4}
          sx={{
            color: "#3b82f6",
            filter: "drop-shadow(0 0 10px rgba(59,130,246,0.5))",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
              strokeDasharray: "1, 200",
              strokeDashoffset: 0,
              animation: "circular-rotate 1.4s ease-in-out infinite"
            }
          }}
        />
      </div>
    </Box>
  );
}
