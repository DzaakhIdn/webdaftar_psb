"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface AdvancedLoadingProps {
  variant?: "dashboard" | "widget" | "chart" | "table";
  showProgress?: boolean;
  progress?: number;
  loadingText?: string;
  height?: number | string;
}

export function AdvancedLoading({
  variant = "dashboard",
  showProgress = false,
  progress = 0,
  loadingText = "Loading...",
  height = 200,
}: AdvancedLoadingProps) {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

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

  if (variant === "widget") {
    return (
      <Card sx={{ p: 3, height }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={20} />
          </motion.div>

          {showProgress && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {loadingText}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Card>
    );
  }

  if (variant === "chart") {
    return (
      <Card sx={{ p: 3, height }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
              <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                height: "calc(100% - 100px)",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
                gap: 1,
                p: 2,
              }}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    height: [20, Math.random() * 100 + 20, 20],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={20}
                    height={60}
                    sx={{ borderRadius: 0.5 }}
                  />
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {showProgress && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ borderRadius: 1 }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ mt: 0.5, display: "block", textAlign: "center" }}
                >
                  {loadingText} {Math.round(progress)}%
                </Typography>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Card>
    );
  }

  if (variant === "table") {
    return (
      <Card sx={{ p: 3, height }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="text" width={100} height={16} />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
            </Box>
          </motion.div>

          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Box sx={{ mb: 1 }}>
                <Skeleton 
                  variant="rectangular" 
                  height={56} 
                  sx={{ 
                    borderRadius: 1,
                    opacity: 1 - (index * 0.1),
                  }} 
                />
              </Box>
            </motion.div>
          ))}

          {showProgress && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ borderRadius: 1 }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {loadingText} {Math.round(progress)}%
                </Typography>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Card>
    );
  }

  // Default dashboard variant
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {loadingText}
          </Typography>
        </motion.div>

        {showProgress && (
          <motion.div variants={itemVariants}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ borderRadius: 1, mb: 2 }}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 2 }} />
        </motion.div>
      </motion.div>
    </Box>
  );
}
