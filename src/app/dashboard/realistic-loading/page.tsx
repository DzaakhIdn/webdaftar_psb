"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { DashboardContent } from "@/layout/dashboard/content";
import { useLoadingSimulation } from "@/hooks/use-loading-simulation";
import { 
  WidgetSummaryLoading, 
  ChartLoading, 
  TableLoading 
} from "@/components/loading";
import { BookingWidgetSummary } from "@/overview/booking-widget-summary";
import { 
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from "@/assets/illustrations";

// ----------------------------------------------------------------------

function RealisticWidgetSummary({ 
  title, 
  total, 
  percent, 
  icon, 
  delay = 0 
}: {
  title: string;
  total: number;
  percent: number;
  icon: React.ReactNode;
  delay?: number;
}) {
  const { isLoading } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 1500,
    autoStart: true 
  });

  if (isLoading) {
    return <WidgetSummaryLoading />;
  }

  return (
    <BookingWidgetSummary
      title={title}
      total={total}
      percent={percent}
      icon={icon}
    />
  );
}

function RealisticChart({ delay = 0 }: { delay?: number }) {
  const { isLoading } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 2000,
    autoStart: true 
  });

  if (isLoading) {
    return <ChartLoading />;
  }

  return (
    <Card sx={{ p: 3, height: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Revenue Chart
      </Typography>
      <Box
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.neutral",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">
          Chart Component Loaded Successfully
        </Typography>
      </Box>
    </Card>
  );
}

function RealisticTable({ delay = 0 }: { delay?: number }) {
  const { isLoading } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 1800,
    autoStart: true 
  });

  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Bookings
      </Typography>
      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.neutral",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">
          Table Component Loaded Successfully
        </Typography>
      </Box>
    </Card>
  );
}

export default function RealisticLoadingPage() {
  const [key, setKey] = useState(0);

  const reloadComponents = () => {
    setKey(prev => prev + 1);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Realistic Dashboard Loading
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Simulasi loading yang realistis dengan delay dan timing yang berbeda untuk setiap komponen
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={reloadComponents}
          sx={{ mb: 3 }}
        >
          Reload Components
        </Button>
      </Box>

      <Grid container spacing={3} key={key}>
        {/* Widget Summaries with staggered loading */}
        <Grid size={{ xs: 12, md: 4 }}>
          <RealisticWidgetSummary
            title="Total Booking"
            total={714000}
            percent={2.6}
            icon={<BookingIllustration />}
            delay={0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <RealisticWidgetSummary
            title="Sold"
            total={311000}
            percent={0.2}
            icon={<CheckInIllustration />}
            delay={300}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <RealisticWidgetSummary
            title="Canceled"
            total={124000}
            percent={-0.1}
            icon={<CheckoutIllustration />}
            delay={600}
          />
        </Grid>

        {/* Chart with longer loading time */}
        <Grid size={{ xs: 12, md: 8 }}>
          <RealisticChart delay={900} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Stats
            </Typography>
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.neutral",
                borderRadius: 1,
              }}
            >
              <Typography color="text.secondary">
                Static Content (No Loading)
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Table with different loading timing */}
        <Grid size={12}>
          <RealisticTable delay={1200} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
