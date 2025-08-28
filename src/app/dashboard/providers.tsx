"use client";

import { ReactNode } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SettingsProvider } from "@/components/settings";
import { ThemeProvider } from "@/theme/theme-provider";
import { createTheme } from "@/theme/create-theme";
import { defaultSettings } from "@/components/settings/settings-config";
import { AuthProvider } from "@/auth/context/auth-context";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ForceLightTheme } from "@/components/force-light-theme";

export function Providers({ children }: { children: ReactNode }) {
  // Force light mode settings
  const forcedLightSettings = {
    ...defaultSettings,
    colorScheme: "light",
  };

  // Create theme with forced light settings
  const theme = createTheme({
    settingsState: forcedLightSettings,
  });

  return (
    <SettingsProvider
      defaultSettings={forcedLightSettings}
      cookieSettings={null}
    >
      <ThemeProvider theme={theme} defaultMode="light" modeStorageKey={null}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <ToastProvider>
              <ForceLightTheme />
              {children}
            </ToastProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
