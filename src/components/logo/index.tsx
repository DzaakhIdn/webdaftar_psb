import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface LogoProps {
  sx?: SxProps<Theme>;
  width?: number;
  height?: number;
  disableLink?: boolean;
}

export function Logo({ sx, width = 40, height = 40, disableLink = false }: LogoProps) {
  const logo = (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{
        width,
        height,
        display: 'inline-flex',
        ...sx,
      }}
    >
      <path
        fill="currentColor"
        d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
      />
    </Box>
  );

  if (disableLink) {
    return logo;
  }

  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: 'inline-flex',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {logo}
    </Box>
  );
}