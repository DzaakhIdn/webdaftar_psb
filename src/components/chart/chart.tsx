import { lazy, Suspense } from "react";
import { useIsClient } from "minimal-shared/hooks";
import { mergeClasses } from "minimal-shared/utils";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { chartClasses } from "./classes";
import { ChartLoading } from "./components";

// ----------------------------------------------------------------------

// Chart types based on ApexCharts
type ChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

// Chart props interface
interface ChartProps {
  type: ChartType;
  series: unknown;
  options?: Record<string, unknown>;
  slotProps?: {
    loading?: SxProps<Theme>;
  };
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

const LazyChart = lazy(() =>
  import("react-apexcharts").then((module) => ({ default: module.default }))
);

export function Chart({
  type,
  series,
  options,
  slotProps,
  className,
  sx,
  ...other
}: ChartProps) {
  const isClient = useIsClient();

  const renderFallback = () => (
    <ChartLoading type={type} sx={slotProps?.loading} className="" />
  );

  return (
    <ChartRoot
      dir="ltr"
      className={mergeClasses([chartClasses.root, className])}
      sx={sx}
      {...other}
    >
      {isClient ? (
        <Suspense fallback={renderFallback()}>
          <LazyChart
            type={type}
            series={series}
            options={options}
            width="100%"
            height="100%"
          />
        </Suspense>
      ) : (
        renderFallback()
      )}
    </ChartRoot>
  );
}

// ----------------------------------------------------------------------

const ChartRoot = styled("div")(({ theme }) => ({
  width: "100%",
  flexShrink: 0,
  position: "relative",
  borderRadius: (theme.shape?.borderRadius as number) * 1.5,
}));
