"use client";

import {
  Box,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DashboardContent } from "@/layout/dashboard_user";
import { RegistrationAnnouncement } from "../anouncement";
import { PengumumanWidget } from "@/components/pengumuman";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { api } from "@/routes/paths";
import { FileUploadReminder } from "../file-upload-reminder";
import { Iconify } from "@/components/iconify";
import { useEffect } from "react";

// Function to get status message and color based on user status
function getStatusInfo(status: string) {
  const statusMap = {
    pending: {
      title: "Menunggu Verifikasi",
      message:
        "Pendaftaran Anda sedang dalam proses verifikasi awal. Silahkan isi formulir pendaftaran, dan upload berkas yang diperlukan.",
      icon: "solar:clock-circle-bold",
      color: "warning" as const,
      bgColor: "warning.lighter" as const,
      iconColor: "warning.main" as const,
    },
    "verifikasi berkas": {
      title: "Verifikasi Berkas",
      message:
        "Berkas pendaftaran Anda sedang dalam proses verifikasi. Tim kami akan menghubungi Anda jika ada berkas yang perlu dilengkapi.",
      icon: "solar:document-text-bold",
      color: "info" as const,
      bgColor: "info.lighter" as const,
      iconColor: "info.main" as const,
    },
    "verifikasi pembayaran": {
      title: "Verifikasi Pembayaran",
      message:
        "Pembayaran pendaftaran Anda sedang dalam proses verifikasi. Mohon tunggu konfirmasi dari tim keuangan.",
      icon: "solar:card-bold",
      color: "info" as const,
      bgColor: "info.lighter" as const,
      iconColor: "info.main" as const,
    },
    "tes wawancara": {
      title: "Tes Wawancara",
      message:
        "Selamat! Anda telah lolos tahap verifikasi dan akan mengikuti tes wawancara. Informasi jadwal akan segera diberitahukan.",
      icon: "solar:microphone-bold",
      color: "primary" as const,
      bgColor: "primary.lighter" as const,
      iconColor: "primary.main" as const,
    },
    "sedang tes": {
      title: "Sedang Tes",
      message:
        "Anda sedang dalam tahap tes. Mohon persiapkan diri dengan baik dan ikuti instruksi yang diberikan.",
      icon: "solar:pen-new-square-bold",
      color: "warning" as const,
      bgColor: "warning.lighter" as const,
      iconColor: "warning.main" as const,
    },
    diterima: {
      title: "Diterima",
      message:
        "Selamat! Anda telah DITERIMA di sekolah kami. Silakan cek email atau WhatsApp untuk informasi lebih lanjut.",
      icon: "solar:check-circle-bold",
      color: "success" as const,
      bgColor: "success.lighter" as const,
      iconColor: "success.main" as const,
    },
    ditolak: {
      title: "Ditolak",
      message:
        "Mohon maaf, pendaftaran Anda belum dapat kami terima pada periode ini. Jangan berkecil hati, Anda dapat mencoba lagi pada periode berikutnya.",
      icon: "solar:close-circle-bold",
      color: "error" as const,
      bgColor: "error.lighter" as const,
      iconColor: "error.main" as const,
    },
  };

  return (
    statusMap[status as keyof typeof statusMap] || {
      title: "Status Pendaftaran",
      message:
        "Status pendaftaran Anda sedang diproses. Mohon tunggu informasi lebih lanjut.",
      icon: "solar:info-circle-bold",
      color: "default" as const,
      bgColor: "grey.100" as const,
      iconColor: "text.secondary" as const,
    }
  );
}

export function OverviewRegistantView() {
  const { user, refreshUser } = useCurrentUser(api.user.me);
  const name = user?.nama_lengkap || "User";
  const userStatus = user?.status_pendaftaran || "pending";
  const statusInfo = getStatusInfo(userStatus);

  // Auto-refresh user data every 30 seconds to check for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refreshUser]);

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
        pt: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        {/* Status Notification Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: `2px solid`,
            borderColor: statusInfo.iconColor,
            bgcolor: statusInfo.bgColor,
            position: "relative",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
              {/* Icon Container */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 16px 0 rgba(145, 158, 171, 0.16)",
                  flexShrink: 0,
                }}
              >
                <Iconify
                  icon={statusInfo.icon}
                  width={32}
                  sx={{ color: statusInfo.iconColor }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Chip
                    label={userStatus.toUpperCase()}
                    color={statusInfo.color}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                  <Tooltip title="Refresh status">
                    <IconButton
                      size="small"
                      onClick={refreshUser}
                      sx={{
                        color: statusInfo.iconColor,
                        "&:hover": { bgcolor: statusInfo.bgColor },
                      }}
                    >
                      <Iconify icon="solar:refresh-bold" width={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                  }}
                >
                  {statusInfo.message}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Decorative Element */}
          <Box
            sx={{
              position: "absolute",
              top: -1,
              right: -1,
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: statusInfo.iconColor,
              opacity: 0.2,
            }}
          />
        </Card>

        <Typography variant="h3" sx={{ mb: 1 }}>
          Hi, {name} 👋
        </Typography>
        <Typography
          sx={{ color: "text.secondary" }}
        >{`Selamat datang di dashboard pendaftaran siswa baru!`}</Typography>
      </Box>
      <Stack spacing={3}>
        <RegistrationAnnouncement />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: { lg: 2 } }}>
            <FileUploadReminder />
          </Box>
          <Box sx={{ flex: { lg: 1 } }}>
            <PengumumanWidget
              targetAudience="calon_siswa"
              maxItems={4}
              showViewAll={true}
              onViewAll={() => {
                // Navigate to pengumuman page - you can implement this
                console.log("Navigate to pengumuman page");
              }}
            />
          </Box>
        </Box>
      </Stack>
    </DashboardContent>
  );
}
