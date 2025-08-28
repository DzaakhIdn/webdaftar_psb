"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DashboardContent } from "@/layout/dashboard/content";
import { BookingWidgetSummary } from "@/overview/booking-widget-summary";
import { BookingWidgetSummaryWithLoading } from "@/overview/booking-widget-summary-with-loading";
import { 
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from "@/assets/illustrations";

// ----------------------------------------------------------------------

export default function LoadingComparisonPage() {
  const [key, setKey] = useState(0);

  const reloadComponents = () => {
    setKey(prev => prev + 1);
  };

  const widgetData = [
    {
      title: "Total Booking",
      total: 714000,
      percent: 2.6,
      icon: <BookingIllustration />,
      delay: 800,
    },
    {
      title: "Sold",
      total: 311000,
      percent: 0.2,
      icon: <CheckInIllustration />,
      delay: 1200,
    },
    {
      title: "Canceled",
      total: 124000,
      percent: -0.1,
      icon: <CheckoutIllustration />,
      delay: 1600,
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Loading Animation Comparison
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Perbandingan komponen dengan dan tanpa loading animation
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={reloadComponents}
          sx={{ mb: 3 }}
        >
          🔄 Reload Components
        </Button>
      </Box>

      <Grid container spacing={4} key={key}>
        {/* Without Loading Animation */}
        <Grid size={12}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            ❌ Without Loading Animation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Komponen langsung muncul tanpa loading state
          </Typography>
          
          <Grid container spacing={3}>
            {widgetData.map((widget, index) => (
              <Grid key={`no-loading-${index}`} size={{ xs: 12, md: 4 }}>
                <BookingWidgetSummary
                  title={widget.title}
                  total={widget.total}
                  percent={widget.percent}
                  icon={widget.icon}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* With Loading Animation */}
        <Grid size={12}>
          <Typography variant="h5" sx={{ mb: 3, mt: 4 }}>
            ✅ With Loading Animation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Komponen menampilkan loading state sebelum konten muncul
          </Typography>
          
          <Grid container spacing={3}>
            {widgetData.map((widget, index) => (
              <Grid key={`with-loading-${index}`} size={{ xs: 12, md: 4 }}>
                <BookingWidgetSummaryWithLoading
                  title={widget.title}
                  total={widget.total}
                  percent={widget.percent}
                  icon={widget.icon}
                  loadingDelay={widget.delay}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Benefits Section */}
        <Grid size={12}>
          <Box sx={{ mt: 6, p: 4, bgcolor: "background.neutral", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              🎯 Benefits of Loading Animations
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    ✨ Better User Experience
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Users understand that content is loading, reducing perceived wait time
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    🎨 Visual Feedback
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Provides immediate visual feedback that the application is working
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    🚀 Professional Look
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Makes the application feel more polished and professional
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    ⚡ Smooth Transitions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prevents jarring content jumps and layout shifts
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
