"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface ComponentLoadingProps {
  variant?: "widget" | "chart" | "table" | "card";
  height?: number | string;
  width?: number | string;
}

export function ComponentLoading({ 
  variant = "card", 
  height = 200, 
  width = "100%" 
}: ComponentLoadingProps) {
  const theme = useTheme();

  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const baseStyles = {
    width,
    height,
    borderRadius: 2,
    background: `linear-gradient(
      90deg,
      ${theme.palette.background.paper} 25%,
      ${theme.palette.action.hover} 50%,
      ${theme.palette.background.paper} 75%
    )`,
    backgroundSize: "200% 100%",
  };

  if (variant === "widget") {
    return (
      <motion.div
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          ...baseStyles,
          height: 120,
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing(2),
          gap: theme.spacing(1),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
        </Box>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="50%" height={16} />
      </motion.div>
    );
  }

  if (variant === "chart") {
    return (
      <motion.div
        variants={pulseVariants}
        animate="pulse"
        style={baseStyles}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            p: 3,
          }}
        >
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto", mb: 1 }} />
            <Skeleton variant="text" width="40%" height={16} sx={{ mx: "auto" }} />
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: "100%", justifyContent: "center" }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={20}
                height={Math.random() * 60 + 20}
                sx={{ borderRadius: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </motion.div>
    );
  }

  if (variant === "table") {
    return (
      <motion.div
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          ...baseStyles,
          height: "auto",
          minHeight: height,
          padding: theme.spacing(2),
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        </Box>
        
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      variants={shimmerVariants}
      animate="shimmer"
      style={{
        ...baseStyles,
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      
      <Skeleton variant="rectangular" height="60%" sx={{ borderRadius: 1, flex: 1 }} />
      
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="text" width="30%" height={16} />
        <Skeleton variant="text" width="20%" height={16} />
      </Box>
    </motion.div>
  );
}

// Specific loading components for different dashboard widgets
export function WidgetSummaryLoading() {
  return <ComponentLoading variant="widget" />;
}

export function ChartLoading() {
  return <ComponentLoading variant="chart" height={300} />;
}

export function TableLoading() {
  return <ComponentLoading variant="table" height={400} />;
}

export function CardLoading({ height = 200 }: { height?: number }) {
  return <ComponentLoading variant="card" height={height} />;
}
