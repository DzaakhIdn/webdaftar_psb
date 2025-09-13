"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";

import { Iconify } from "@/components/iconify";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

interface RegistrationStatus {
  isOpen: boolean;
  startDate?: string;
  endDate?: string;
  title: string;
  description: string;
}

interface AnnouncementProps {
  onRegisterClick?: () => void;
}

export function RegistrationAnnouncement({
  onRegisterClick,
}: AnnouncementProps) {
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus>({
      isOpen: true, // Default untuk demo, nanti bisa diambil dari API
      startDate: "12 Spetember 2025",
      endDate: "25 Desember 2025",
      title: "Pendaftaran Siswa Baru Tahun Ajaran 2025/2026",
      description:
        "Pendaftaran siswa baru untuk tahun ajaran 2025/2026 telah dibuka. Silakan lengkapi formulir pendaftaran dengan data yang valid dan upload dokumen yang diperlukan.",
    });

  // Simulasi fetch status pendaftaran dari API
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchRegistrationStatus().then(setRegistrationStatus);
  }, []);

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      // Default action - redirect to registration form
      window.location.href = paths.registant.register;
    }
  };

  if (registrationStatus.isOpen) {
    return (
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: (theme) =>
            `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: (theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: (theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        />

        <CardContent sx={{ position: "relative", p: 3 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: (theme) =>
                    alpha(theme.palette.primary.main, 0.12),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:document-add-bold-duotone"
                  width={24}
                  sx={{ color: "primary.main" }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  {registrationStatus.title}
                </Typography>
                <Chip
                  label="Pendaftaran Dibuka"
                  color="primary"
                  size="small"
                  icon={<Iconify icon="solar:check-circle-bold" width={16} />}
                />
              </Box>
            </Stack>

            {/* Content */}
            <Typography variant="body1" color="text.secondary">
              {registrationStatus.description}
            </Typography>

            {/* Period Info */}
            <Alert severity="info" sx={{ bgcolor: "transparent" }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:calendar-bold-duotone" width={20} />
                <Typography variant="body2">
                  Periode pendaftaran: {registrationStatus.startDate} -{" "}
                  {registrationStatus.endDate}
                </Typography>
              </Stack>
            </Alert>

            {/* Action Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={
                <Iconify
                  icon="solar:pen-new-square-bold"
                  sx={{ color: "#FFFFFF !important" }}
                />
              }
              onClick={handleRegisterClick}
              sx={{
                py: 1.5,
                color: "#FFFFFF !important",
                fontWeight: 600,
                backgroundColor: "#078DEE !important",
                backgroundImage:
                  "linear-gradient(135deg, #078DEE 0%, #0351AB 100%) !important",
                border: "none !important",
                "& .MuiButton-startIcon": {
                  color: "#FFFFFF !important",
                },
                "& span": {
                  color: "#FFFFFF !important",
                },
                "&:hover": {
                  backgroundColor: "#0351AB !important",
                  backgroundImage:
                    "linear-gradient(135deg, #0351AB 0%, #078DEE 100%) !important",
                  color: "#FFFFFF !important",
                  "& .MuiButton-startIcon": {
                    color: "#FFFFFF !important",
                  },
                  "& span": {
                    color: "#FFFFFF !important",
                  },
                },
              }}
            >
              Isi Formulir Pendaftaran
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Registration Closed State
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.grey[500],
            0.08
          )} 0%, ${alpha(theme.palette.grey[500], 0.02)} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
        }}
      />

      <CardContent sx={{ position: "relative", p: 3 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              background: (theme) => alpha(theme.palette.grey[500], 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Iconify
              icon="solar:document-text-bold-duotone"
              width={32}
              sx={{ color: "text.disabled" }}
            />
          </Box>

          {/* Header */}
          <Stack spacing={1} alignItems="center">
            <Typography variant="h5" color="text.primary">
              {registrationStatus.title}
            </Typography>
            <Chip
              label="Pendaftaran Ditutup"
              size="small"
              icon={
                <Iconify
                  icon="solar:clock-circle-bold"
                  width={16}
                  sx={{ color: "#FFFFFF !important" }}
                />
              }
              sx={{
                backgroundColor: "#6B7280 !important",
                color: "#FFFFFF !important",
                border: "none !important",
                "& .MuiChip-label": {
                  color: "#FFFFFF !important",
                  fontWeight: 500,
                },
                "& .MuiChip-icon": {
                  color: "#FFFFFF !important",
                },
                "& span": {
                  color: "#FFFFFF !important",
                },
                "& svg": {
                  color: "#FFFFFF !important",
                },
              }}
            />
          </Stack>

          {/* Content */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 480 }}
          >
            Pendaftaran untuk tahun ajaran ini telah ditutup. Silakan pantau
            pengumuman untuk informasi pendaftaran periode selanjutnya.
          </Typography>

          {/* Period Info */}
          <Alert
            severity="warning"
            sx={{ bgcolor: "transparent", width: "100%" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="center"
            >
              <Iconify icon="solar:calendar-bold-duotone" width={20} />
              <Typography variant="body2">
                {registrationStatus.endDate
                  ? `Pendaftaran ditutup pada: ${registrationStatus.endDate}`
                  : "Pendaftaran belum dibuka"}
              </Typography>
            </Stack>
          </Alert>

          {/* Info Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:info-circle-bold" />}
            sx={{ mt: 2 }}
          >
            Hubungi Admin untuk Info Lebih Lanjut
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
