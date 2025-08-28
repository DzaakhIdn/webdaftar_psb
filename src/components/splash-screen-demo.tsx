"use client";

import { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { SplashScreen } from "./splash-screen";
import { SplashScreenAdvanced } from "./splash-screen-advanced";
import { SplashScreenMinimal } from "./splash-screen-minimal";

export function SplashScreenDemo() {
  const [showBasic, setShowBasic] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMinimal, setShowMinimal] = useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: "#1e293b" }}>
        Splash Screen Components
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: "#374151" }}>
            Basic Splash Screen
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#64748b" }}>
            Simple splash screen dengan logo dan loading indicator
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setShowBasic(true)}
            sx={{ textTransform: "none" }}
          >
            Show Basic Splash
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: "#374151" }}>
            Advanced Splash Screen
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#64748b" }}>
            Splash screen dengan progress bar dan animasi yang lebih kompleks
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setShowAdvanced(true)}
            sx={{ textTransform: "none" }}
          >
            Show Advanced Splash
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: "#374151" }}>
            Minimal Splash Screen
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#64748b" }}>
            Splash screen yang sangat minimalist dan clean
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setShowMinimal(true)}
            sx={{ textTransform: "none" }}
          >
            Show Minimal Splash
          </Button>
        </Box>
      </Stack>

      {/* Usage Example */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: "#f8fafc", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#374151" }}>
          Usage Example
        </Typography>
        <Typography 
          component="pre" 
          sx={{ 
            fontSize: "0.75rem", 
            color: "#64748b",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            lineHeight: 1.6
          }}
        >
{`import { SplashScreen } from "./components/splash-screen";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <SplashScreen 
        loading={loading}
        onComplete={() => setLoading(false)}
        duration={2000}
      />
      {!loading && <YourMainContent />}
    </>
  );
}`}
        </Typography>
      </Box>

      {/* Splash Screen Components */}
      <SplashScreen 
        loading={showBasic}
        onComplete={() => setShowBasic(false)}
        duration={2000}
      />

      <SplashScreenAdvanced 
        loading={showAdvanced}
        onComplete={() => setShowAdvanced(false)}
        duration={3000}
        showProgress={true}
      />

      <SplashScreenMinimal 
        loading={showMinimal}
        onComplete={() => setShowMinimal(false)}
        duration={1500}
      />
    </Box>
  );
}
