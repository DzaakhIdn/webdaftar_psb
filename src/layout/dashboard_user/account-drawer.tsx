"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { AnimateBorder } from "@/components/animate/animate-border";
import { AccountButton } from "@/components/account-button";
import { SignOutButton } from "@/components/sign-out-button";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { api } from "@/routes/paths";

// ----------------------------------------------------------------------

interface MenuOption {
  label: string;
  href: string;
  icon: React.ReactNode;
  info?: string;
}

interface AccountDrawerProps {
  data: MenuOption[];
  sx?: SxProps<Theme>;
}

export function AccountDrawer({
  data = [
    {
      label: "Home",
      href: "/registant",
      icon: <Iconify icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: "Biodata",
      href: "/registant/biodata",
      icon: <Iconify icon="custom:profile-duotone" />,
    }
  ],
  sx,
  ...other
}: AccountDrawerProps) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  const { user, loading } = useCurrentUser(api.user.me);

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: "6px", width: 96, height: 96, borderRadius: "50%" }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: "primary.main" } },
      }}
    >
      <Avatar
        alt={user?.nama_lengkap}
        sx={{
          width: "100%",
          height: "100%",
          border: "2px solid",
          borderColor: "primary.main",
        }}
      >
        {user?.avatar_url ? (
          <img src={user?.avatar_url} alt={user?.nama_lengkap} />
        ) : (
          user?.nama_lengkap?.charAt(0).toUpperCase()
        )}
      </Avatar>
    </AnimateBorder>
  );

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          "& li": { p: 0 },
        }),
      ]}
    >
      {data.map((option) => (
        <MenuItem key={option.label}>
          <Link
            href={option.href}
            color="inherit"
            underline="none"
            onClick={onClose}
            sx={{
              p: 1,
              width: 1,
              display: "flex",
              typography: "body2",
              alignItems: "center",
              color: "text.secondary",
              "& svg": { width: 24, height: 24 },
              "&:hover": { color: "text.primary" },
            }}
          >
            {option.icon}

            <Box component="span" sx={{ ml: 2 }}>
              {option.label}
            </Box>

            {option.info && (
              <Label color="error" sx={{ ml: 1 }}>
                {option.info}
              </Label>
            )}
          </Link>
        </MenuItem>
      ))}
    </MenuList>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={undefined}
        displayName={user?.nama_lengkap}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: "absolute",
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {user?.nama_lengkap}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
              noWrap
            >
              {user?.email}
            </Typography>
          </Box>

          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'center' }}>
            <Label
              variant="filled"
              color={
                (user?.status_pendaftaran === "active" && "success") ||
                (user?.status_pendaftaran === "pending" && "warning") ||
                (user?.status_pendaftaran === "banned" && "error") ||
                "default"
              }
            >
              {user?.status_pendaftaran}
            </Label>
          </Box>

          {renderList()}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
