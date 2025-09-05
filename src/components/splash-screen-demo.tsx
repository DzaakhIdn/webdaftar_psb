"use client";

import { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import SplashScreen from "./splash-screen";
import { SplashScreenAdvanced } from "./splash-screen-advanced";
import { SplashScreenMinimal } from "./splash-screen-minimal";

export function SplashScreenDemo() {
  const [showBasic, setShowBasic] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMinimal, setShowMinimal] = useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 600, color: "#1e293b" }}
      >
        Splash Screen Components
      </Typography>

      <Stack spacing={3}>
        {/* Basic Splash Screen */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            1. Basic Splash Screen
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Splash screen dengan logo, text, dan loading indicator sederhana
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowBasic(true)}
            disabled={showBasic}
          >
            {showBasic ? "Loading..." : "Show Basic Splash"}
          </Button>
        </Box>

        {/* Advanced Splash Screen */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            2. Advanced Splash Screen
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Splash screen dengan progress bar, animated dots, dan background
            effects
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowAdvanced(true)}
            disabled={showAdvanced}
          >
            {showAdvanced ? "Loading..." : "Show Advanced Splash"}
          </Button>
        </Box>

        {/* Minimal Splash Screen */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            3. Minimal Splash Screen
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Splash screen minimal dengan animasi simple dan clean design
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowMinimal(true)}
            disabled={showMinimal}
          >
            {showMinimal ? "Loading..." : "Show Minimal Splash"}
          </Button>
        </Box>

        {/* Usage Example */}
        <Box sx={{ mt: 4, p: 3, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            💡 Usage Example
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "#374151",
              whiteSpace: "pre-wrap",
            }}
          >
            {`import { useState } from "react";
import { SplashScreen } from "@/components/splash-screen";

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
      </Stack>

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
