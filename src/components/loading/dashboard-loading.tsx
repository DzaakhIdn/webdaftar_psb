"use client";

import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { DashboardContent } from "@/layout/dashboard/content";

// ----------------------------------------------------------------------

interface DashboardLoadingProps {
  variant?: "overview" | "table" | "form" | "minimal";
}

// Loading wrapper component for Suspense
export function DashboardLoadingFallback() {
  return <DashboardLoading variant="overview" />;
}

export function TableLoadingFallback() {
  return <DashboardLoading variant="table" />;
}

export function FormLoadingFallback() {
  return <DashboardLoading variant="form" />;
}

export function MinimalLoadingFallback() {
  return <DashboardLoading variant="minimal" />;
}

export function DashboardLoading({
  variant = "overview",
}: DashboardLoadingProps) {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (variant === "minimal") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              border: `3px solid ${theme.palette.primary.main}`,
              borderTop: `3px solid transparent`,
              borderRadius: "50%",
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (variant === "table") {
    return (
      <DashboardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Skeleton
              variant="rectangular"
              height={60}
              sx={{ mb: 3, borderRadius: 2 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 2 }}>
              <Skeleton
                variant="rectangular"
                height={56}
                sx={{ borderRadius: 1 }}
              />
            </Box>
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Box sx={{ mb: 1 }}>
                  <Skeleton
                    variant="rectangular"
                    height={72}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </DashboardContent>
    );
  }

  if (variant === "form") {
    return (
      <DashboardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            <Grid size={12}>
              <motion.div variants={itemVariants}>
                <Skeleton
                  variant="rectangular"
                  height={60}
                  sx={{ mb: 3, borderRadius: 2 }}
                />
              </motion.div>
            </Grid>

            {Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <motion.div variants={itemVariants}>
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                </motion.div>
              </Grid>
            ))}

            <Grid size={12}>
              <motion.div variants={itemVariants}>
                <Skeleton
                  variant="rectangular"
                  height={120}
                  sx={{ mb: 2, borderRadius: 1 }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </DashboardContent>
    );
  }

  // Default overview variant
  return (
    <DashboardContent maxWidth="xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {/* Widget Summary Cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={`widget-${index}`} size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <motion.div variants={pulseVariants} animate="pulse">
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                    }}
                  />
                </motion.div>
              </motion.div>
            </Grid>
          ))}

          {/* Statistics Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div variants={itemVariants}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2, mb: 3 }}
              />
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Details and Check-in Widgets */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div variants={itemVariants}>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div variants={itemVariants}>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </motion.div>
          </Grid>

          {/* Table Section */}
          <Grid size={12}>
            <motion.div variants={itemVariants}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </DashboardContent>
  );
}
