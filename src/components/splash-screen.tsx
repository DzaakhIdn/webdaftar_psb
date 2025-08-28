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

    const container = containerRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const progress = progressRef.current;
    const glow = glowRef.current;

    if (!container || !logo || !text || !progress || !glow) return;

    // Initial state
    gsap.set([logo, text, progress], { opacity: 0, y: 30 });
    gsap.set(glow, { opacity: 0, scale: 0.8 });

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out animation
        gsap.to(container, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }
    });

    // Entrance animations
    tl.to(glow, {
      opacity: 0.3,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .to(text, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3")
    .to(progress, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        zIndex: 9999,
      }}
    >
      {/* Background Glow */}
      <Box
        ref={glowRef}
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Logo */}
      <Box
        ref={logoRef}
        sx={{
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Image
          src="/assets/important/logo.png"
          alt="Logo"
          width={80}
          height={80}
          style={{
            filter: "brightness(0) invert(1)",
          }}
        />
      </Box>

      {/* App Name */}
      <Typography
        ref={textRef}
        variant="h4"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 4,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        Dashboard App
      </Typography>

      {/* Loading Indicator */}
      <Box
        ref={progressRef}
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <CircularProgress
          size={40}
          thickness={3}
          sx={{
            color: "white",
            opacity: 0.8,
          }}
        />
      </Box>
    </Box>
  );
}
