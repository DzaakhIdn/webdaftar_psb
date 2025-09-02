"use client";

import { Upload } from "@/components/upload";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Card } from "@/components/ui/card";
import { Iconify } from "@/components/iconify";

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
}: FileUploadProps) {
  console.log(`FileUpload ${title}:`, {
    value,
    existingFileUrl,
    finalValue: value || existingFileUrl,
    loading
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
      <Upload
        value={value || existingFileUrl}
        onDrop={onDrop}
        onDelete={onDelete}
        helperText={helperText}
        disabled={loading}
      />
    </Card>
  );
}
