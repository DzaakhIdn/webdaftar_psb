
"use client";

import { useId, type ComponentProps, type CSSProperties } from "react";
import { Icon } from "@iconify/react";
import { mergeClasses } from "minimal-shared/utils";

import { styled, type SxProps, type Theme } from "@mui/material/styles";

import { iconifyClasses } from "./classes";
import { allIconNames, registerIcons } from "./register-icons";

// Props
export type IconifyProps = Omit<ComponentProps<typeof Icon>, 'icon' | 'width' | 'height' | 'className' | 'style' | 'ref'> & {
  icon: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------

export function Iconify({
  className,
  icon,
  width = 20,
  height,
  sx,
  ...other
}: IconifyProps) {
  const id = useId();

  if (!allIconNames.includes(icon)) {
    console.warn(
      [
        `Icon "${icon}" is currently loaded online, which may cause flickering effects.`,
        `To ensure a smoother experience, please register your icon collection for offline use.`,
        `More information is available at: https://docs.minimals.cc/icons/`,
      ].join("\n")
    );
  }

  registerIcons();

  return (
    <IconRoot
      ssr
      id={id}
      icon={icon}
      className={mergeClasses([iconifyClasses.root, className])}
      sx={[
        { width, flexShrink: 0, height: height ?? width, display: 'inline-flex' },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

const IconRoot = styled(Icon)``;

