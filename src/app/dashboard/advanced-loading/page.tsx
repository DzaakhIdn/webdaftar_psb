"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DashboardContent } from "@/layout/dashboard/content";
import { useLoadingSimulation } from "@/hooks/use-loading-simulation";
import { AdvancedLoading } from "@/components/loading";

// ----------------------------------------------------------------------

function AdvancedWidgetDemo({ delay = 0 }: { delay?: number }) {
  const { isLoading, progress } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 2000,
    autoStart: true 
  });

  if (isLoading) {
    return (
      <AdvancedLoading
        variant="widget"
        showProgress
        progress={progress}
        loadingText="Loading widget data..."
        height={180}
      />
    );
  }

  return (
    <Card sx={{ p: 3, height: 180 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Typography variant="h6" color="white">
            $
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">Total Revenue</Typography>
          <Typography variant="body2" color="text.secondary">
            Last 30 days
          </Typography>
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        $24,500
      </Typography>
      <Typography variant="body2" color="success.main">
        +12.5% from last month
      </Typography>
    </Card>
  );
}

function AdvancedChartDemo({ delay = 0 }: { delay?: number }) {
  const { isLoading, progress } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 3000,
    autoStart: true 
  });

  if (isLoading) {
    return (
      <AdvancedLoading
        variant="chart"
        showProgress
        progress={progress}
        loadingText="Generating chart..."
        height={400}
      />
    );
  }

  return (
    <Card sx={{ p: 3, height: 400 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6">Sales Analytics</Typography>
          <Typography variant="body2" color="text.secondary">
            Monthly performance
          </Typography>
        </Box>
        <Button variant="outlined" size="small">
          Export
        </Button>
      </Box>
      <Box
        sx={{
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.neutral",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">
          📊 Chart Component Loaded
        </Typography>
      </Box>
    </Card>
  );
}

function AdvancedTableDemo({ delay = 0 }: { delay?: number }) {
  const { isLoading, progress } = useLoadingSimulation({ 
    delay, 
    minLoadingTime: 2500,
    autoStart: true 
  });

  if (isLoading) {
    return (
      <AdvancedLoading
        variant="table"
        showProgress
        progress={progress}
        loadingText="Fetching table data..."
        height={500}
      />
    );
  }

  return (
    <Card sx={{ p: 3, height: 500 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6">Recent Orders</Typography>
          <Typography variant="body2" color="text.secondary">
            Latest customer orders
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small">
            Filter
          </Button>
          <Button variant="contained" size="small">
            Export
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          height: 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.neutral",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">
          📋 Table Component Loaded
        </Typography>
      </Box>
    </Card>
  );
}

export default function AdvancedLoadingPage() {
  const [key, setKey] = useState(0);

  const reloadComponents = () => {
    setKey(prev => prev + 1);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Advanced Loading Animations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Loading animations dengan progress indicator dan timing yang realistis
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={reloadComponents}
          sx={{ mb: 3 }}
        >
          🔄 Reload All Components
        </Button>
      </Box>

      <Grid container spacing={3} key={key}>
        {/* Widget Cards with Progress */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid key={`widget-${index}`} size={{ xs: 12, md: 4 }}>
            <AdvancedWidgetDemo delay={index * 400} />
          </Grid>
        ))}

        {/* Chart with Progress */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AdvancedChartDemo delay={1200} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Box
              sx={{
                height: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.neutral",
                borderRadius: 1,
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                ⚡ Static Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No loading animation
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Table with Progress */}
        <Grid size={12}>
          <AdvancedTableDemo delay={1800} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
