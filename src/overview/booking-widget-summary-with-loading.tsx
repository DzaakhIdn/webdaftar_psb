"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { type SxProps, type Theme } from "@mui/material/styles";

import { fPercent } from "@/utils/format-number";

import { Iconify } from "@/components/iconify";
import { AnimateCountUp } from "@/components/animate";
import { WidgetSummaryLoading } from "@/components/loading";

// ----------------------------------------------------------------------

interface BookingWidgetSummaryWithLoadingProps {
  title: string;
  percent: number;
  total: number;
  icon: React.ReactNode;
  sx?: SxProps<Theme>;
  loadingDelay?: number;
  [key: string]: unknown;
}

export function BookingWidgetSummaryWithLoading({
  title,
  percent,
  total,
  icon,
  sx,
  loadingDelay = 1000,
  ...other
}: BookingWidgetSummaryWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);

    return () => clearTimeout(timer);
  }, [loadingDelay]);

  if (isLoading) {
    return <WidgetSummaryLoading />;
  }

  const renderTrending = () => (
    <Box
      sx={{
        gap: 0.5,
        display: "flex",
        alignItems: "center",
        typography: "subtitle2",
      }}
    >
      <Iconify
        width={24}
        icon={
          percent < 0
            ? "solar:double-alt-arrow-down-bold-duotone"
            : "solar:double-alt-arrow-up-bold-duotone"
        }
        sx={{
          flexShrink: 0,
          color: "success.main",
          ...(percent < 0 && { color: "error.main" }),
        }}
      />
      <span>
        {percent > 0 && "+"}
        {fPercent(percent)}
      </span>
    </Box>
  );

  return (
    <Card
      sx={[
        {
          p: 3,
          gap: 2,
          display: "flex",
          alignItems: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>{icon}</Box>

      <Box sx={{ flexGrow: 1, minWidth: 112 }}>
        <Box sx={{ mb: 1, typography: "subtitle2" }}>{title}</Box>

        <Box sx={{ mb: 1, typography: "h3" }}>
          <AnimateCountUp to={total} />
        </Box>

        {renderTrending()}
      </Box>
    </Card>
  );
}
