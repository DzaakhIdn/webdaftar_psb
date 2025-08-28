"use client";

import {
  createTheme as createMuiTheme,
  Theme,
  ThemeOptions,
} from "@mui/material/styles";

import { mixins } from "./core/mixins";
import { shadows } from "./core/shadows";
import { palette } from "./core/palette";
import { themeConfig } from "./theme-config";
import { components } from "./core/components";
import { typography } from "./core/typography";
import { customShadows } from "./core/custom-shadows";
import {
  updateCoreWithSettings,
  updateComponentsWithSettings,
} from "./with-settings";

// ----------------------------------------------------------------------

interface CreateThemeParams {
  settingsState?: Record<string, unknown>;
  themeOverrides?: ThemeOptions;
  localeComponents?: Record<string, unknown>;
}

export const baseTheme: Record<string, unknown> = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
    },
    // Force dark scheme to use light values to prevent system detection
    dark: {
      palette: palette.light, // Use light palette for dark scheme too
      shadows: shadows.light, // Use light shadows for dark scheme too
      customShadows: customShadows.light, // Use light shadows for dark scheme too
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction as "ltr" | "rtl",
  cssVariables: themeConfig.cssVariables,
  defaultColorScheme: "light", // Force light mode
};

// ----------------------------------------------------------------------

export function createTheme({
  settingsState,
  themeOverrides = {},
  localeComponents = {},
}: CreateThemeParams = {}): Theme {
  // Update core theme settings
  const updatedCore = settingsState
    ? updateCoreWithSettings(baseTheme, settingsState)
    : baseTheme;

  // Update component settings
  const updatedComponents = settingsState
    ? updateComponentsWithSettings(components, settingsState)
    : {};

  // Create and return the final theme
  const theme = createMuiTheme(
    updatedCore as ThemeOptions,
    updatedComponents as ThemeOptions,
    localeComponents as ThemeOptions,
    themeOverrides
  );

  return theme;
}
