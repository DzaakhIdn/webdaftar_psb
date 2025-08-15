"use client";

import type { ReactNode } from "react";
import { mergeClasses } from "minimal-shared/utils";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { layoutClasses } from "./classes";

// ----------------------------------------------------------------------

interface MainSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className" | "children"> {
  sx?: SxProps<Theme> | SxProps<Theme>[];
  children?: ReactNode;
  className?: string;
}

export function MainSection({
  children,
  className,
  sx,
  ...other
}: MainSectionProps) {
  const rootSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <MainRoot
      className={mergeClasses([layoutClasses.main, className])}
      sx={rootSx as SxProps<Theme>}
      {...other}
    >
      {children}
    </MainRoot>
  );
}


const MainRoot = styled("main")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
});
