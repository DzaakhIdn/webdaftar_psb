"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as ThemeVarsProvider,
  ThemeOptions,
  Theme,
} from "@mui/material/styles";
import { ReactNode } from "react";

// import { useTranslate } from '@/locales";

// import { useSettingsContext } from '@/components/settings";

import { createTheme } from "./create-theme";
import { Rtl } from "./with-settings/right-to-left";

// ----------------------------------------------------------------------

// Type for createTheme function parameters
interface CreateThemeParams {
  settingsState?: unknown;
  themeOverrides?: ThemeOptions;
  localeComponents?: unknown;
}

interface ThemeProviderProps {
  themeOverrides?: ThemeOptions;
  children: ReactNode;
  [key: string]: unknown;
}

export function ThemeProvider({
  themeOverrides,
  children,
  ...other
}: ThemeProviderProps) {
  // const { currentLang } = useTranslate();

  // const settings = useSettingsContext();

  // Force light mode by providing explicit settings state
  const forcedLightSettings = {
    direction: "ltr",
    contrast: "default",
    primaryColor: "preset1",
  };

  const theme = (createTheme as (params: CreateThemeParams) => Theme)({
    settingsState: forcedLightSettings,
    // localeComponents: currentLang?.systemValue,
    themeOverrides,
  });

  return (
    <ThemeVarsProvider
      disableTransitionOnChange
      theme={theme}
      defaultMode="light"
      modeStorageKey={undefined}
      {...other}
    >
      <CssBaseline />
      <Rtl direction={"ltr"}>{children}</Rtl>
    </ThemeVarsProvider>
  );
}
