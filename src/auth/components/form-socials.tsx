import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function FormSocials({
  sx,
  signInWithGoogle,
  singInWithGithub,
  signInWithTwitter,
  ...other
}: {
  sx?: any;
  signInWithGoogle?: any;
  singInWithGithub?: any;
  signInWithTwitter?: any;
}) {
  return (
    <Box
      sx={[
        {
          gap: 2,
          display: "flex",
          justifyContent: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton
        className="social-button"
        color="inherit"
        onClick={signInWithGoogle}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          border: (theme: any) =>
            `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          background: (theme: any) =>
            alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme: any) =>
              `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
            background: (theme: any) => alpha(theme.palette.primary.main, 0.05),
            borderColor: (theme: any) => alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        <Iconify width={24} icon="socials:google" />
      </IconButton>

      <IconButton
        className="social-button"
        color="inherit"
        onClick={singInWithGithub}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          border: (theme: any) =>
            `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          background: (theme: any) =>
            alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme: any) =>
              `0 4px 12px ${alpha(theme.palette.grey[900], 0.15)}`,
            background: (theme: any) => alpha(theme.palette.grey[900], 0.05),
            borderColor: (theme: any) => alpha(theme.palette.grey[900], 0.3),
          },
        }}
      >
        <Iconify width={24} icon="socials:github" />
      </IconButton>

      <IconButton
        className="social-button"
        color="inherit"
        onClick={signInWithTwitter}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          border: (theme: any) =>
            `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          background: (theme: any) =>
            alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme: any) => `0 4px 12px ${alpha("#1DA1F2", 0.15)}`,
            background: (theme: any) => alpha("#1DA1F2", 0.05),
            borderColor: (theme: any) => alpha("#1DA1F2", 0.3),
          },
        }}
      >
        <Iconify width={24} icon="socials:twitter" />
      </IconButton>
    </Box>
  );
}
