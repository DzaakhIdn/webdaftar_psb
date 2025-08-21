import { useState, useCallback, useEffect } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { useTheme, alpha as hexAlpha } from "@mui/material/styles";

import { fShortenNumber } from "@/utils/format-number";
import { Chart, useChart, ChartSelect, ChartLegends } from "@/components/chart";

// ----------------------------------------------------------------------

interface BookingStatisticsProps {
  title: string;
  subheader: string;
  chart: {
    series: {
      name: string;
      categories: string[];
      data: { name: string; value: number[] }[];
    }[];
    colors?: string[];
    options?: Record<string, unknown>;
  };
  sx?: Record<string, unknown>;
}

export function BookingStatistics({
  title,
  subheader,
  chart,
  sx,
  ...other
}: BookingStatisticsProps) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState(() => {
    // Initialize with the first available series to prevent hydration issues
    return chart.series?.[0]?.name || "Yearly";
  });

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  // Ensure selectedSeries is valid after mount to prevent hydration issues
  useEffect(() => {
    if (chart.series && chart.series.length > 0) {
      const validSeries = chart.series.find((i) => i.name === selectedSeries);
      if (!validSeries) {
        setSelectedSeries(chart.series[0].name);
      }
    }
  }, [chart.series, selectedSeries]);

  // Early return if no data to prevent hydration issues
  if (
    !chart.series ||
    chart.series.length === 0 ||
    !currentSeries ||
    !currentSeries.data ||
    currentSeries.data.length === 0
  ) {
    return (
      <Card sx={sx} {...other}>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
        <div
          style={{
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading chart data...
        </div>
      </Card>
    );
  }

  const chartColors = [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.error.main, 0.48),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ["transparent"] },
    xaxis: {
      categories: currentSeries?.categories || [],
      type: "category",
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${Math.round(value)}`,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    // Exclude potentially problematic options from chart.options
    ...(chart.options && typeof chart.options === "object"
      ? {
          ...Object.fromEntries(
            Object.entries(chart.options).filter(
              ([key, value]) =>
                ![
                  "xaxis",
                  "yaxis",
                  "plotOptions",
                  "dataLabels",
                  "series",
                  "chart",
                ].includes(key) &&
                value !== null &&
                value !== undefined
            )
          ),
        }
      : {}),
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors ?? []}
        labels={chart.series[0]?.data?.map((item) => item.name) || []}
        values={[fShortenNumber(6789), fShortenNumber(1234)]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="bar"
        series={
          currentSeries?.data
            ?.map((item) => ({
              name: item.name || "Unknown",
              data: Array.isArray(item.value)
                ? item.value.map((val) => (typeof val === "number" ? val : 0))
                : [],
            }))
            .filter((series) => series.data.length > 0) || []
        }
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}
