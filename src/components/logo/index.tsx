import React from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

interface LogoProps {
  sx?: SxProps<Theme>;
  width?: number;
  height?: number;
  disableLink?: boolean;
}

export function Logo({
  sx,
  width = 40,
  height = 40,
  disableLink = false,
}: LogoProps) {
  const logo = (
    <Box
      component="img"
      src="/assets/important/logo.png"
      alt="Logo"
      sx={{
        width,
        height,
        display: "inline-flex",
        ...sx,
      }}
    />
  );

  if (disableLink) {
    return logo;
  }

  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: "inline-flex",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {logo}
    </Box>
  );
}
