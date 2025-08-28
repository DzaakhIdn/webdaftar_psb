"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DashboardContent } from "@/layout/dashboard/content";
import { 
  ComponentLoading, 
  WidgetSummaryLoading, 
  ChartLoading, 
  TableLoading, 
  CardLoading 
} from "@/components/loading";

// ----------------------------------------------------------------------

export default function DemoLoadingPage() {
  const [showLoading, setShowLoading] = useState(true);

  const toggleLoading = () => {
    setShowLoading(!showLoading);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Dashboard Loading Animations Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Demonstrasi berbagai jenis loading animation untuk komponen dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={toggleLoading}
          sx={{ mb: 3 }}
        >
          {showLoading ? "Hide Loading" : "Show Loading"}
        </Button>
      </Box>

      {showLoading ? (
        <Grid container spacing={3}>
          {/* Widget Summary Loading */}
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Widget Summary Loading
            </Typography>
          </Grid>
          
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={`widget-${index}`} size={{ xs: 12, md: 4 }}>
              <WidgetSummaryLoading />
            </Grid>
          ))}

          {/* Chart Loading */}
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              Chart Loading
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 8 }}>
            <ChartLoading />
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <CardLoading height={300} />
          </Grid>

          {/* Table Loading */}
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              Table Loading
            </Typography>
          </Grid>
          
          <Grid size={12}>
            <TableLoading />
          </Grid>

          {/* Various Card Loading */}
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              Various Card Loading
            </Typography>
          </Grid>
          
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={`card-${index}`} size={{ xs: 12, sm: 6, md: 3 }}>
              <CardLoading height={180} />
            </Grid>
          ))}

          {/* Custom Component Loading */}
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              Custom Component Loading
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <ComponentLoading variant="widget" height={150} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <ComponentLoading variant="chart" height={150} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid size={12}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Actual Dashboard Content Would Be Here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Show Loading" to see the loading animations again
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </DashboardContent>
  );
}
