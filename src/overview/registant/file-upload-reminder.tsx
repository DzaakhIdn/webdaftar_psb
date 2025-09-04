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
import { supabase } from "@/utils/supabase/client";

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

// Interface untuk required files dari database
interface RequiredFile {
  id_required: number;
  nama_berkas: string;
  deskripsi: string;
  wajib: boolean;
}

interface UploadedFile {
  id_berkas: number;
  id_required: number;
  path_berkas: string;
  status_verifikasi: string;
}

// Helper function to get icon based on file name
const getFileIcon = (fileName: string): string => {
  const name = fileName.toLowerCase();

  if (name.includes("kartu keluarga") || name.includes("kk")) {
    return "solar:users-group-rounded-bold-duotone";
  }
  if (name.includes("akta") || name.includes("kelahiran")) {
    return "solar:document-text-bold-duotone";
  }
  if (name.includes("ijazah") || name.includes("lulus")) {
    return "solar:diploma-bold-duotone";
  }
  if (name.includes("foto") || name.includes("pas foto")) {
    return "solar:camera-bold-duotone";
  }
  if (name.includes("sehat") || name.includes("kesehatan")) {
    return "solar:health-bold-duotone";
  }

  // Default icon for other documents
  return "solar:document-bold-duotone";
};

export function FileUploadReminder({ onUploadClick }: FileUploadReminderProps) {
  const [requiredFiles, setRequiredFiles] = useState<RequiredFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus>({
    isComplete: false,
    completedFiles: [],
    pendingFiles: [],
    title: "Upload Dokumen Pendaftaran",
    description:
      "Silakan upload dokumen-dokumen yang diperlukan untuk melengkapi pendaftaran Anda.",
  });

  const { user: currentUser } = useCurrentUser(api.user.me);
  const { showError } = useToast();

  // Fetch required files from database
  useEffect(() => {
    const fetchRequiredFiles = async () => {
      try {
        const data = await showAllData("requiredfile");
        setRequiredFiles(data as RequiredFile[]);
      } catch (error) {
        console.error("Error fetching required files:", error);
        showError("Gagal memuat daftar berkas yang diperlukan");
      }
    };

    fetchRequiredFiles();
  }, [showError]);

  // Fetch uploaded files for current user
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!currentUser?.id) return;

      try {
        // Get uploaded files for current user
        const { data, error } = await supabase
          .from("berkassiswa")
          .select(
            `
            id_berkas,
            id_required,
            path_berkas,
            status_verifikasi
          `
          )
          .eq("id_siswa", currentUser.id);

        if (error) throw error;

        setUploadedFiles(data || []);
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        showError("Gagal memuat status upload berkas");
      }
    };

    fetchUploadedFiles();
  }, [currentUser, showError]);

  // Update upload status based on required files and uploaded files
  useEffect(() => {
    if (requiredFiles.length === 0) return;

    const completedFiles: string[] = [];
    const pendingFiles: string[] = [];
    const mandatoryFiles = requiredFiles.filter((file) => file.wajib);

    requiredFiles.forEach((requiredFile) => {
      const uploadedFile = uploadedFiles.find(
        (uploaded) => uploaded.id_required === requiredFile.id_required
      );

      if (uploadedFile && uploadedFile.path_berkas) {
        completedFiles.push(requiredFile.nama_berkas);
      } else {
        pendingFiles.push(requiredFile.nama_berkas);
      }
    });

    // Check if all mandatory files are completed
    const completedMandatoryFiles = mandatoryFiles.filter((file) =>
      completedFiles.includes(file.nama_berkas)
    );
    const isComplete =
      completedMandatoryFiles.length === mandatoryFiles.length &&
      mandatoryFiles.length > 0;

    setUploadStatus({
      isComplete,
      completedFiles,
      pendingFiles,
      title: isComplete ? "Dokumen Lengkap" : "Upload Dokumen Pendaftaran",
      description: isComplete
        ? "Semua dokumen wajib telah berhasil diupload. Pendaftaran Anda sudah lengkap!"
        : `Silakan upload dokumen-dokumen yang diperlukan untuk melengkapi pendaftaran Anda. ${mandatoryFiles.length} dokumen wajib harus diupload.`,
    });
  }, [requiredFiles, uploadedFiles]);

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
                  {uploadStatus.completedFiles.map((fileName) => (
                    <ListItem key={fileName} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Iconify
                          icon="solar:check-circle-bold"
                          width={20}
                          sx={{ color: "success.main" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={fileName}
                        slotProps={{
                          primary: {
                            variant: "body2",
                            color: "text.secondary",
                          },
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
                    file.nama_berkas
                  );
                  return (
                    <ListItem key={file.id_required} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Iconify
                          icon={
                            isCompleted
                              ? "solar:check-circle-bold"
                              : getFileIcon(file.nama_berkas)
                          }
                          width={20}
                          sx={{
                            color: isCompleted
                              ? "success.main"
                              : "primary.main",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.nama_berkas}
                        secondary={file.deskripsi}
                        slotProps={{
                          primary: {
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
                          },
                          secondary: {
                            variant: "caption",
                            color: "text.disabled",
                          },
                        }}
                      />
                      <Stack direction="row" spacing={1} alignItems="center">
                        {file.wajib && (
                          <Chip
                            label="Wajib"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                        {isCompleted && (
                          <Chip
                            label="Selesai"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
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
