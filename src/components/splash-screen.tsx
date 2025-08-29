"use client";

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { gsap } from "gsap";

interface SplashScreenProps {
  loading?: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({
  loading = true,
  onComplete,
  duration = 2000,
}: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;

    const container = containerRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    const dots = dotsRef.current;

    if (!container || !content || !logo || !dots) return;

    // Initial state
    gsap.set([content, logo], { opacity: 0, y: 30 });
    gsap.set(dots, { opacity: 0 });

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          },
        });
      },
    });

    // Logo animation
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      // Dots animation
      .to(
        dots,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      // Content fade in
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Animate dots
    gsap.to(dots.children, {
      scale: 1.2,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
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
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(29, 78, 216, 0.2) 0%, transparent 50%)
          `,
        },
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo/Brand */}
        <Box
          ref={logoRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                zIndex: -1,
              },
            }}
          >
            <img src="/assets/important/logo.png" alt="Logo" />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Animated Loading Text */}
            {["L", "O", "A", "D", "I", "N", "G"].map((letter, index) => (
              <Typography
                key={index}
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  letterSpacing: "0.05em",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                {letter}
              </Typography>
            ))}

            {/* Animated dots */}
            <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    animation: `pulse 1.4s ease-in-out ${
                      index * 0.2
                    }s infinite`,
                    "@keyframes pulse": {
                      "0%, 80%, 100%": {
                        opacity: 0.3,
                        transform: "scale(1)",
                      },
                      "40%": {
                        opacity: 1,
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box
          ref={dotsRef}
          sx={{
            width: 200,
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: "100%",
              borderRadius: 2,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))",
              animation: "loading 2s ease-in-out infinite",
              "@keyframes loading": {
                "0%": {
                  width: "0%",
                  transform: "translateX(-100%)",
                },
                "50%": {
                  width: "100%",
                  transform: "translateX(0%)",
                },
                "100%": {
                  width: "100%",
                  transform: "translateX(100%)",
                },
              },
            }}
          />
        </Box>

        {/* Subtitle */}
        <Box ref={contentRef}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.8rem",
              fontWeight: 300,
              letterSpacing: "0.1em",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
              opacity: 0.9,
            }}
          >
            SISTEM PENDAFTARAN
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
