"use client";

import type { ReactNode } from "react";
import { useScrollOffsetTop } from "minimal-shared/hooks";
import { varAlpha, mergeClasses } from "minimal-shared/utils";

import AppBar from "@mui/material/AppBar";
import {
  styled,
  alpha,
  useTheme,
  type SxProps,
  type Theme,
  type Breakpoint,
} from "@mui/material/styles";
import Container from "@mui/material/Container";

import { layoutClasses } from "./classes";

// ----------------------------------------------------------------------

type HeaderRootProps = {
  isOffset?: boolean;
  disableOffset?: boolean;
  disableElevation?: boolean;
};

type HeaderContainerProps = {
  layoutQuery?: Breakpoint;
};

type HeaderSectionSlots = {
  topArea?: ReactNode;
  leftArea?: ReactNode;
  centerArea?: ReactNode;
  rightArea?: ReactNode;
  bottomArea?: ReactNode;
};

type HeaderSectionSlotProps = {
  container?: Partial<HeaderContainerProps> &
    Omit<React.ComponentProps<typeof Container>, "sx"> & {
      sx?: SxProps<Theme>;
    };
  centerArea?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

type HeaderSectionProps = {
  sx?: SxProps<Theme> | SxProps<Theme>[];
  slots?: HeaderSectionSlots;
  slotProps?: HeaderSectionSlotProps;
  className?: string;
  disableOffset?: boolean;
  disableElevation?: boolean;
  layoutQuery?: Breakpoint;
} & Omit<React.ComponentProps<typeof AppBar>, "color" | "position">;

export function HeaderSection({
  sx,
  slots,
  slotProps,
  className,
  disableOffset,
  disableElevation,
  layoutQuery = "md",
  ...other
}: HeaderSectionProps) {
  const { offsetTop: isOffset } = useScrollOffsetTop();
  const theme = useTheme();

  const textPrimary =
    theme.vars?.palette?.text?.primary ?? theme.palette.text.primary;
  const styleVars: React.CSSProperties | undefined = isOffset
    ? ({
        ["--color"]: `var(--offset-color, ${textPrimary})`,
      } as React.CSSProperties)
    : undefined;

  const rootSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <HeaderRoot
      position="sticky"
      color="transparent"
      isOffset={isOffset}
      disableOffset={disableOffset}
      disableElevation={disableElevation}
      className={mergeClasses([layoutClasses.header, className])}
      sx={rootSx as SxProps<Theme>}
      style={styleVars}
      {...other}
    >
      {slots?.topArea}

      <HeaderContainer layoutQuery={layoutQuery} {...slotProps?.container}>
        {slots?.leftArea}

        <HeaderCenterArea {...slotProps?.centerArea}>
          {slots?.centerArea}
        </HeaderCenterArea>

        {slots?.rightArea}
      </HeaderContainer>

      {slots?.bottomArea}
    </HeaderRoot>
  );
}

// ----------------------------------------------------------------------

const HeaderRoot = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !["isOffset", "disableOffset", "disableElevation"].includes(prop as string),
})<HeaderRootProps>(
  ({
    isOffset = false,
    disableOffset = false,
    disableElevation = false,
    theme,
  }) => {
    const pauseZindex = { top: -1, bottom: -2 };

    const pauseStyles = {
      opacity: 0,
      content: '""',
      visibility: "hidden",
      position: "absolute",
      transition: theme.transitions.create(["opacity", "visibility"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
    } as const;

    const bgColor = theme.vars?.palette?.background?.defaultChannel
      ? varAlpha(theme.vars.palette.background.defaultChannel, 0.8)
      : alpha(theme.palette.background.default, 0.8);

    const bgStyles = {
      backdropFilter: `blur(var(--layout-header-blur))`,
      WebkitBackdropFilter: `blur(var(--layout-header-blur))`,
      backgroundColor: bgColor,
      ...pauseStyles,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: pauseZindex.top,
      ...(isOffset && { opacity: 1, visibility: "visible" }),
    } as const;

    type ThemeWithCustomShadows = Theme & {
      vars?: { customShadows?: Record<string, string> };
    };
    const z8 =
      (theme as ThemeWithCustomShadows).vars?.customShadows?.z8 ??
      theme.shadows[8];

    const shadowStyles = {
      ...pauseStyles,
      left: 0,
      right: 0,
      bottom: 0,
      height: 24,
      margin: "auto",
      borderRadius: "50%",
      width: `calc(100% - 48px)`,
      zIndex: pauseZindex.bottom,
      boxShadow: z8,
      ...(isOffset && { opacity: 0.48, visibility: "visible" }),
    } as const;

    return {
      zIndex: "var(--layout-header-zIndex)",
      ...(!disableOffset && { "&::before": bgStyles }),
      ...(!disableElevation && { "&::after": shadowStyles }),
    } as const;
  }
);

const HeaderContainer = styled(Container, {
  shouldForwardProp: (prop) => !["layoutQuery"].includes(prop as string),
})<HeaderContainerProps>(({ layoutQuery = "md", theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "var(--color)",
  height: "var(--layout-header-mobile-height)",
  [theme.breakpoints.up(layoutQuery)]: {
    height: "var(--layout-header-desktop-height)",
  },
}));

const HeaderCenterArea = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  justifyContent: "center",
}));
