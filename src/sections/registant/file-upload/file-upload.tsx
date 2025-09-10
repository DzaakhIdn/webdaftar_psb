"use client";

import { Upload } from "@/components/upload";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Card } from "@/components/ui/card";
import { Iconify } from "@/components/iconify";
import { useState } from "react";

interface FileUploadProps {
  title: string;
  optional?: boolean;
  helperText?: string;
  description?: string;
  onDrop: (files: File[]) => void;
  onDelete: () => void;
  value?: File;
  existingFileUrl?: string;
  loading?: boolean;
  exampleImageUrl?: string;
}

export function FileUpload({
  title,
  optional,
  helperText,
  description,
  onDrop,
  onDelete,
  value,
  existingFileUrl,
  loading = false,
  exampleImageUrl,
}: FileUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  console.log(`FileUpload ${title}:`, {
    value,
    existingFileUrl,
    finalValue: value || existingFileUrl,
    loading,
  });

  return (
    <Card className="p-5 flex flex-col gap-5">
      <Box className="flex items-center gap-2">
        <Typography variant="h4">{title}</Typography>
        {loading && <CircularProgress size={20} />}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {loading
          ? "📤 Mengupload berkas..."
          : existingFileUrl && !value
          ? "✅ Berkas sudah diupload sebelumnya"
          : optional
          ? "(Opsional) Upload salah satu dokumen"
          : ""}
      </Typography>
      <Box className="mb-3 flex items-center gap-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <Iconify
          icon="solar:info-circle-bold-duotone"
          sx={{ color: "primary.main", width: 24, height: 24 }}
        />
        <Typography variant="body2" color="text.primary" sx={{ flex: 1 }}>
          {description}
        </Typography>
      </Box>

      {/* Example Image Preview */}
      {exampleImageUrl && (
        <Box sx={{
          mb: 3,
          p: 3,
          bgcolor: "success.lighter",
          borderRadius: 2,
          border: 1,
          borderColor: "success.light"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Iconify
              icon="solar:gallery-bold-duotone"
              sx={{ color: "success.main", width: 20, height: 20 }}
            />
            <Typography variant="subtitle2" color="success.dark">
              Contoh Gambar 
            </Typography>
          </Box>
          <Box
            onClick={() => setPreviewOpen(true)}
            sx={{
              position: "relative",
              cursor: "pointer",
              borderRadius: 2,
              overflow: "hidden",
              border: 2,
              borderColor: "success.light",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor: "success.main",
                transform: "scale(1.02)",
                "& .overlay": {
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                },
                "& .preview-icon": {
                  opacity: 1,
                },
              },
            }}
          >
            <Box
              component="img"
              src={exampleImageUrl}
              alt={`Contoh ${title}`}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                bgcolor: "grey.100",
              }}
              onError={(e) => {
                // Hide image if failed to load
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Overlay */}
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Box
                className="preview-icon"
                sx={{
                  opacity: 0,
                  bgcolor: "white",
                  borderRadius: "50%",
                  p: 1.5,
                  boxShadow: 2,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Iconify
                  icon="solar:eye-bold"
                  sx={{ color: "primary.main", width: 24, height: 24 }}
                />
              </Box>
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block", textAlign: "center" }}
          >
            Klik gambar untuk melihat preview lebih besar
          </Typography>
        </Box>
      )}

      <Upload
        value={value || existingFileUrl}
        onDrop={onDrop}
        onDelete={onDelete}
        helperText={helperText}
        disabled={loading}
      />

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Typography variant="h6">Contoh Format: {title}</Typography>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <Iconify icon="solar:close-circle-bold" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            bgcolor: "background.paper",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {exampleImageUrl && (
            <Box
              component="img"
              src={exampleImageUrl}
              alt={`Contoh ${title}`}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
