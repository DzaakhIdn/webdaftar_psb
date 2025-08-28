"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import { DashboardContent } from "@/layout/dashboard/content";
import {
  NavigationProgress,
  SimpleNavigationProgress,
  TopLoadingBar,
  TopLoadingBarWithText,
} from "@/components/navigation-progress";

// ----------------------------------------------------------------------

export default function NavigationLoadingDemoPage() {
  const [demoType, setDemoType] = useState<
    "top" | "simple" | "advanced" | "withText"
  >("top");
  const [color, setColor] = useState<
    "primary" | "secondary" | "success" | "warning" | "error"
  >("primary");
  const [style, setStyle] = useState<"solid" | "gradient" | "glow" | "pulse">(
    "glow"
  );
  const [height, setHeight] = useState(3);
  const [showDemo, setShowDemo] = useState(false);

  const triggerDemo = () => {
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 1000);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Navigation Loading Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Demo loading indicator yang muncul saat navigasi antar halaman
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              🎛️ Controls
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Demo Type</InputLabel>
                <Select
                  value={demoType}
                  label="Demo Type"
                  onChange={(e) => setDemoType(e.target.value as any)}
                >
                  <MenuItem value="top">Top Loading Bar</MenuItem>
                  <MenuItem value="simple">Simple Progress</MenuItem>
                  <MenuItem value="advanced">Advanced Progress</MenuItem>
                  <MenuItem value="withText">With Text & Percentage</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={color}
                  label="Color"
                  onChange={(e) => setColor(e.target.value as any)}
                >
                  <MenuItem value="primary">Primary</MenuItem>
                  <MenuItem value="secondary">Secondary</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {(demoType === "top" || demoType === "withText") && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Style</InputLabel>
                  <Select
                    value={style}
                    label="Style"
                    onChange={(e) => setStyle(e.target.value as any)}
                  >
                    <MenuItem value="solid">Solid</MenuItem>
                    <MenuItem value="gradient">Gradient</MenuItem>
                    <MenuItem value="glow">Glow</MenuItem>
                    <MenuItem value="pulse">Pulse</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Height: {height}px</Typography>
              <Slider
                value={height}
                onChange={(_, value) => setHeight(value as number)}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={triggerDemo}
              sx={{ mb: 2 }}
            >
              🚀 Trigger Demo
            </Button>

            <Typography variant="caption" color="text.secondary">
              Klik tombol di atas untuk melihat demo loading, atau navigasi ke
              halaman lain untuk melihat loading otomatis
            </Typography>
          </Card>
        </Grid>

        {/* Preview */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              📱 Preview
            </Typography>

            <Box sx={{ position: "relative", minHeight: 300 }}>
              {/* Demo Loading Components */}
              {showDemo && demoType === "top" && (
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <TopLoadingBar height={height} color={color} style={style} />
                </Box>
              )}

              {showDemo && demoType === "simple" && (
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <SimpleNavigationProgress height={height} color={color} />
                </Box>
              )}

              {showDemo && demoType === "advanced" && (
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <NavigationProgress height={height} color={color} />
                </Box>
              )}

              {showDemo && demoType === "withText" && (
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                  <TopLoadingBarWithText
                    height={height}
                    color={color}
                    style={style}
                    showText={true}
                    showPercentage={true}
                  />
                </Box>
              )}

              {/* Content */}
              <Box
                sx={{
                  pt: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 250,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Navigation Loading Preview
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Current settings: {demoType} - {color} - {height}px
                  {(demoType === "top" || demoType === "withText") &&
                    ` - ${style}`}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Button variant="outlined" href="/dashboard">
                    Go to Overview
                  </Button>
                  <Button variant="outlined" href="/dashboard/demo-loading">
                    Go to Loading Demo
                  </Button>
                  <Button
                    variant="outlined"
                    href="/dashboard/realistic-loading"
                  >
                    Go to Realistic Loading
                  </Button>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Info */}
        <Grid size={12}>
          <Card sx={{ p: 3, bgcolor: "background.neutral" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ℹ️ How It Works
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  🔄 Automatic Detection
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Loading indicator otomatis muncul saat pathname atau search
                  params berubah menggunakan Next.js navigation hooks.
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  ⚡ Performance Optimized
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Menggunakan Framer Motion untuk animasi yang smooth dan
                  cleanup yang proper untuk mencegah memory leaks.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  🎨 Customizable Styles
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Berbagai pilihan warna, tinggi, dan style (solid, gradient,
                  glow, pulse) untuk menyesuaikan dengan design system.
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  📱 Responsive Design
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loading indicator responsive dan bekerja dengan baik di semua
                  ukuran layar.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
