// TypeScript declarations to extend MUI theme with custom mixins and properties

import "@mui/material/styles";
import "@mui/material/Chip";
import { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/styles" {
  interface Mixins {
    borderGradient: (props?: {
      color?: string;
      padding?: string | number;
    }) => any;
    bgGradient: (props: {
      sizes?: string[];
      repeats?: string[];
      images?: string[];
      positions?: string[];
    }) => any;
    bgBlur: (props: { color?: string; blur?: number; imgUrl?: string }) => any;
    textGradient: (color: string) => any;
    paperStyles: (
      theme: Theme,
      options?: { blur?: number; color?: string; dropdown?: boolean }
    ) => any;
    menuItemStyles: (theme: Theme) => any;
    maxLine: (props: {
      line: number;
      persistent?: { fontSize?: string; lineHeight?: string };
    }) => any;
    hideScrollX: any;
    hideScrollY: any;
  }

  interface TypographyVariants {
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
  }

  interface TypographyVariantsOptions {
    fontWeightSemiBold?: React.CSSProperties["fontWeight"];
  }

  interface Theme {
    vars: {
      palette: any;
      customShadows: any;
    };
  }

  interface ThemeOptions {
    vars?: {
      palette?: any;
      customShadows?: any;
    };
  }
}
