"use client";

import { useState } from "react";
import { varAlpha } from "minimal-shared/utils";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";

import { Label } from "./label";
import { Iconify } from "./iconify";
import { Scrollbar } from "./scrollbar";
import { AnimateBorder } from "./animate/animate-border";
import { AccountButton } from "./account-button";
import { SignOutButton } from "./sign-out-button";

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
      href: "/",
      icon: <Iconify icon="solar:home-angle-bold-duotone" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <Iconify icon="custom:profile-duotone" />,
    },
    {
      label: "Projects",
      href: "#",
      icon: <Iconify icon="solar:notes-bold-duotone" />,
      info: "3",
    },
    {
      label: "Subscription",
      href: "#",
      icon: <Iconify icon="custom:invoice-duotone" />,
    },
    {
      label: "Security",
      href: "#",
      icon: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
    },
    {
      label: "Account settings",
      href: "#",
      icon: <Iconify icon="solar:settings-bold-duotone" />,
    },
  ],
  sx,
  ...other
}: AccountDrawerProps) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: "6px", width: 96, height: 96, borderRadius: "50%" }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: "primary.main" } },
      }}
    >
      <Avatar
        sx={{
          width: "100%",
          height: "100%",
          border: "2px solid",
          borderColor: "primary.main",
          bgcolor: "background.paper",
        }}
      >
        avatar
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
        displayName="John Doe"
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
              John Doe
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
              noWrap
            >
              john.doe@example.com
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              gap: 1,
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {[1, 2, 3].map((index) => (
              <Tooltip key={index} title={`Switch to: User ${index}`}>
                <Avatar alt={`User ${index}`} onClick={() => {}}>
                  {`U${index}`}
                </Avatar>
              </Tooltip>
            ))}

            <Tooltip title="Add account">
              <IconButton
                sx={[
                  (theme) => ({
                    bgcolor: varAlpha(
                      theme.vars.palette.grey["500Channel"],
                      0.08
                    ),
                    border: `dashed 1px ${varAlpha(
                      theme.vars.palette.grey["500Channel"],
                      0.32
                    )}`,
                  }),
                ]}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Tooltip>
          </Box>

          {renderList()}

          <Box sx={{ px: 2.5, py: 3 }}>
            {/* Static upgrade block content */}
            <div>Upgrade Block Placeholder</div>
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
