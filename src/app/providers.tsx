"use client";

import { ReactNode } from "react";
import { SettingsProvider } from "@/components/settings";
import { ThemeProvider } from "@/theme/theme-provider";
import { createTheme } from "@/theme/create-theme";
import { defaultSettings } from "@/components/settings/settings-config";

const theme = createTheme();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider
      defaultSettings={defaultSettings}
      cookieSettings={null}
    >
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </SettingsProvider>
  );
}