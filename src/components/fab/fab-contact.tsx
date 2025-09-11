"use client";

import { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from "@mui/material";
import { Iconify } from "@/components/iconify";

export function FabContact() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const contactActions = [
    {
      icon: <Iconify icon="solar:user-bold-duotone" width={24} height={24} />,
      name: "Kontak Ikhwan",
      onClick: () => {
        window.open("https://wa.me/6289524513151", "_blank");
        handleClose();
      },
      color: "#1976d2", // Blue for Ikhwan
    },
    {
      icon: (
        <Iconify icon="solar:user-heart-bold-duotone" width={24} height={24} />
      ),
      name: "Kontak Akhwat",
      onClick: () => {
        window.open("https://wa.me/6281246273673", "_blank"); // Different number for Akhwat
        handleClose();
      },
      color: "#e91e63", // Pink for Akhwat
    },
  ];

  return (
    <>
      {/* Backdrop for mobile - close when tap outside */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: "transparent",
          }}
          onClick={handleClose}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 24, md: 32 },
          right: { xs: 24, md: 32 },
          zIndex: 1000,
        }}
      >
        <SpeedDial
          ariaLabel="Contact Options"
          icon={
            <SpeedDialIcon
              icon={
                <Iconify
                  icon="solar:chat-round-line-bold-duotone"
                  width={30}
                  height={30}
                />
              }
              openIcon={
                <Iconify
                  icon="solar:close-circle-bold-duotone"
                  width={30}
                  height={30}
                />
              }
            />
          }
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
          FabProps={{
            onClick: (event) => {
              event.stopPropagation();
              if (open) {
                handleClose();
              } else {
                handleOpen();
              }
            },
          }}
          sx={{
            "& .MuiFab-primary": {
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease-in-out",
            },
            "& .MuiSpeedDialIcon-root": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            },
          }}
        >
          {contactActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={action.onClick}
              slotProps={{
                tooltip: {
                  title: action.name,
                  placement: "left",
                  arrow: true,
                },
                fab: {
                  "aria-label": action.name,
                  sx: {
                    bgcolor: action.color,
                    color: "white",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: action.color,
                      transform: "scale(1.1)",
                      filter: "brightness(1.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                  },
                },
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  );
}
