"use client";

import { mergeClasses } from "minimal-shared/utils";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { svgColorClasses } from "./classes";

// ----------------------------------------------------------------------

interface SvgColorProps
  extends Omit<React.ComponentProps<"span">, "className"> {
  src: string;
  className?: string;
  sx?: SxProps<Theme> | SxProps<Theme>[];
}

export function SvgColor({ src, className, sx, ...other }: SvgColorProps) {
  const rootSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <SvgRoot
      className={mergeClasses([svgColorClasses.root, className])}
      sx={
        [
          {
            mask: `url(${src}) no-repeat center / contain`,
            WebkitMask: `url(${src}) no-repeat center / contain`,
          },
          ...rootSx,
        ] as SxProps<Theme>
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

const SvgRoot = styled("span")(() => ({
  width: 24,
  height: 24,
  flexShrink: 0,
  display: "inline-flex",
  backgroundColor: "currentColor",
}));
