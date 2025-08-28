import { m } from "framer-motion";
import { varAlpha } from "minimal-shared/utils";
import { ReactNode } from "react";

import { styled, SxProps, Theme } from "@mui/material/styles";

import { Logo } from "../logo";

// ----------------------------------------------------------------------

interface AnimateLogoSlotProps {
  logo?: {
    sx?: SxProps<Theme> | SxProps<Theme>[];
    [key: string]: unknown;
  };
}

interface AnimateLogoZoomProps extends Omit<React.ComponentProps<"div">, "sx"> {
  logo?: ReactNode;
  slotProps?: AnimateLogoSlotProps;
  sx?: SxProps<Theme>;
}

export function AnimateLogoZoom({
  logo,
  slotProps,
  sx,
  ...other
}: AnimateLogoZoomProps) {
  return (
    <LogoZoomRoot sx={sx} {...other}>
      <m.span
        animate={{ scale: [1, 0.9, 0.9, 1, 1], opacity: [1, 0.48, 0.48, 1, 1] }}
        transition={{
          duration: 2,
          repeatDelay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {logo ?? (
          <Logo
            disableLink
            {...slotProps?.logo}
            sx={
              [
                { width: 64, height: 64 },
                ...(Array.isArray(slotProps?.logo?.sx)
                  ? slotProps?.logo?.sx ?? []
                  : slotProps?.logo?.sx
                  ? [slotProps?.logo?.sx]
                  : []),
              ] as SxProps<Theme>
            }
          />
        )}
      </m.span>

      <LogoZoomPrimaryOutline
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
      />

      <LogoZoomSecondaryOutline
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
      />
    </LogoZoomRoot>
  );
}

const LogoZoomRoot = styled("div")(() => ({
  width: 120,
  height: 120,
  alignItems: "center",
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
}));

const LogoZoomPrimaryOutline = styled(m.span)(({ theme }) => ({
  position: "absolute",
  width: "calc(100% - 20px)",
  height: "calc(100% - 20px)",
  border: `solid 3px ${varAlpha(
    theme.vars?.palette?.primary?.darkChannel ||
      theme.palette?.primary?.dark ||
      "#007867",
    0.24
  )}`,
}));

const LogoZoomSecondaryOutline = styled(m.span)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  border: `solid 8px ${varAlpha(
    theme.vars?.palette?.primary?.darkChannel ||
      theme.palette?.primary?.dark ||
      "#007867",
    0.24
  )}`,
}));

// ----------------------------------------------------------------------

interface AnimateLogoRotateProps
  extends Omit<React.ComponentProps<"div">, "sx"> {
  logo?: ReactNode;
  slotProps?: AnimateLogoSlotProps;
  sx?: SxProps<Theme>;
}

export function AnimateLogoRotate({
  logo,
  sx,
  slotProps,
  ...other
}: AnimateLogoRotateProps) {
  return (
    <LogoRotateRoot sx={sx} {...other}>
      {logo ?? (
        <Logo
          {...slotProps?.logo}
          sx={
            [
              { zIndex: 9, width: 40, height: 40 },
              ...(Array.isArray(slotProps?.logo?.sx)
                ? slotProps?.logo?.sx ?? []
                : slotProps?.logo?.sx
                ? [slotProps?.logo?.sx]
                : []),
            ] as SxProps<Theme>
          }
        />
      )}

      <LogoRotateBackground
        animate={{ rotate: 360 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
      />
    </LogoRotateRoot>
  );
}

const LogoRotateRoot = styled("div")(() => ({
  width: 96,
  height: 96,
  alignItems: "center",
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
}));

const LogoRotateBackground = styled(m.span)(({ theme }) => ({
  width: "100%",
  height: "100%",
  opacity: 0.16,
  borderRadius: "50%",
  position: "absolute",
  backgroundImage: `linear-gradient(135deg, transparent 50%, ${
    theme.vars?.palette?.primary?.main ||
    theme.palette?.primary?.main ||
    "#00A76F"
  } 100%)`,
  transition: theme.transitions.create(["opacity"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
}));
