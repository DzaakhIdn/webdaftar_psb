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

const theme = createTheme();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider defaultSettings={defaultSettings} cookieSettings={null}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
