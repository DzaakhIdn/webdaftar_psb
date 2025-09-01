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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha } from "@mui/material/styles";

import { Iconify } from "@/components/iconify";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { useToast } from "@/components/providers/toast-provider";
import { showAllData } from "@/models";
import { api } from "@/routes/paths";

// ----------------------------------------------------------------------

interface FileUploadStatus {
  isComplete: boolean;
  completedFiles: string[];
  pendingFiles: string[];
  title: string;
  description: string;
}

interface FileUploadReminderProps {
  onUploadClick?: () => void;
}

// Daftar file yang harus diupload
const requiredFiles = [
  {
    name: "Kartu Keluarga (KK)",
    icon: "solar:users-group-rounded-bold-duotone",
  },
  { name: "Akta Kelahiran", icon: "solar:document-text-bold-duotone" },
  { name: "Ijazah/Surat Keterangan Lulus", icon: "solar:diploma-bold-duotone" },
  { name: "Pas Foto 3x4", icon: "solar:camera-bold-duotone" },
  { name: "Surat Keterangan Sehat", icon: "solar:health-bold-duotone" },
];

export function FileUploadReminder({ onUploadClick }: FileUploadReminderProps) {
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>({
    isComplete: false,
    completedFiles: [],
    pendingFiles: requiredFiles.map((f) => f.name),
    title: "Upload Dokumen Pendaftaran",
    description:
      "Silakan upload dokumen-dokumen yang diperlukan untuk melengkapi pendaftaran Anda.",
  });

  const { user: currentUser } = useCurrentUser(api.user.me);
  const { showError } = useToast();

  // Pengecekan status upload dari database
  useEffect(() => {
    const checkUploadStatus = async () => {
      if (!currentUser) return;

      try {
        const data = await showAllData("calonsiswa");
        const userData = data.find((r: any) => r.id_siswa === currentUser.id);

        if (userData) {
          // Cek apakah status pendaftaran sudah lengkap
          const hasAllFiles = userData.status_pendaftaran === "lengkap";

          if (hasAllFiles) {
            setUploadStatus({
              isComplete: true,
              completedFiles: requiredFiles.map((f) => f.name),
              pendingFiles: [],
              title: "Dokumen Lengkap",
              description:
                "Semua dokumen telah berhasil diupload. Pendaftaran Anda sudah lengkap!",
            });
          } else {
            // Simulasi file yang sudah diupload (bisa disesuaikan dengan field database)
            const completedFiles = userData.foto_siswa ? ["Pas Foto 3x4"] : [];
            const pendingFiles = requiredFiles
              .map((f) => f.name)
              .filter((name) => !completedFiles.includes(name));

            setUploadStatus({
              isComplete: false,
              completedFiles,
              pendingFiles,
              title: "Upload Dokumen Pendaftaran",
              description:
                "Silakan upload dokumen-dokumen yang diperlukan untuk melengkapi pendaftaran Anda.",
            });
          }
        }
      } catch (error) {
        console.error("Error checking upload status:", error);
        showError("Gagal memuat status upload");
      }
    };

    checkUploadStatus();
  }, [currentUser, showError]);

  const handleUploadClick = () => {
    if (onUploadClick) {
      onUploadClick();
    } else {
      // Default action - redirect to upload page
      window.location.href = "/registant/files-upload";
    }
  };

  // Jika sudah lengkap, tampilkan success state
  if (uploadStatus.isComplete) {
    return (
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.success.main,
              0.08
            )} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
          border: (theme) =>
            `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
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
            background: (theme) => alpha(theme.palette.success.main, 0.08),
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
            background: (theme) => alpha(theme.palette.success.main, 0.08),
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
                    alpha(theme.palette.success.main, 0.12),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:check-circle-bold-duotone"
                  width={24}
                  sx={{ color: "success.main" }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  {uploadStatus.title}
                </Typography>
                <Chip
                  label="Dokumen Lengkap"
                  color="success"
                  size="small"
                  icon={<Iconify icon="solar:check-circle-bold" width={16} />}
                />
              </Box>
            </Stack>

            {/* Content */}
            <Typography variant="body1" color="text.secondary">
              {uploadStatus.description}
            </Typography>

            {/* Completed Files List */}
            <Alert severity="success" sx={{ bgcolor: "transparent" }}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  Dokumen yang telah diupload:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {requiredFiles.map((file) => (
                    <ListItem key={file.name} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Iconify
                          icon="solar:check-circle-bold"
                          width={20}
                          sx={{ color: "success.main" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Jika belum lengkap, tampilkan reminder state
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.warning.main,
            0.08
          )} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
        border: (theme) =>
          `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
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
          background: (theme) => alpha(theme.palette.warning.main, 0.08),
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
          background: (theme) => alpha(theme.palette.warning.main, 0.08),
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
                background: (theme) => alpha(theme.palette.warning.main, 0.12),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Iconify
                icon="solar:upload-square-bold-duotone"
                width={24}
                sx={{ color: "warning.main" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {uploadStatus.title}
              </Typography>
              <Chip
                label={`${uploadStatus.pendingFiles.length} Dokumen Belum Upload`}
                color="warning"
                size="small"
                icon={<Iconify icon="solar:clock-circle-bold" width={16} />}
              />
            </Box>
          </Stack>

          {/* Content */}
          <Typography variant="body1" color="text.secondary">
            {uploadStatus.description}
          </Typography>

          {/* Required Files List */}
          <Alert severity="warning" sx={{ bgcolor: "transparent" }}>
            <Stack spacing={2}>
              <Typography variant="body2" fontWeight={600}>
                Dokumen yang harus diupload:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {requiredFiles.map((file) => {
                  const isCompleted = uploadStatus.completedFiles.includes(
                    file.name
                  );
                  return (
                    <ListItem key={file.name} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Iconify
                          icon={
                            isCompleted
                              ? "solar:check-circle-bold"
                              : "solar:clock-circle-bold"
                          }
                          width={20}
                          sx={{
                            color: isCompleted
                              ? "success.main"
                              : "warning.main",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: isCompleted
                            ? "text.secondary"
                            : "text.primary",
                          sx: {
                            textDecoration: isCompleted
                              ? "line-through"
                              : "none",
                            opacity: isCompleted ? 0.7 : 1,
                          },
                        }}
                      />
                      {isCompleted && (
                        <Chip
                          label="Selesai"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          </Alert>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={
              <Iconify
                icon="solar:upload-bold"
                sx={{ color: "#FFFFFF !important" }}
              />
            }
            onClick={handleUploadClick}
            sx={{
              py: 1.5,
              color: "#FFFFFF !important",
              fontWeight: 600,
              backgroundColor: "#FF8C00 !important",
              backgroundImage:
                "linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%) !important",
              border: "none !important",
              "& .MuiButton-startIcon": {
                color: "#FFFFFF !important",
              },
              "& span": {
                color: "#FFFFFF !important",
              },
              "&:hover": {
                backgroundColor: "#FF6B00 !important",
                backgroundImage:
                  "linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%) !important",
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
            Upload Dokumen Sekarang
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
