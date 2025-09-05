import { forwardRef, useCallback, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

interface UploadProps {
  value?: File | File[] | string;
  onDrop?: (files: File[]) => void;
  onDelete?: () => void;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

const UploadRoot = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: theme.transitions.create(["border-color", "background-color"]),
  minHeight: "160px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    minHeight: "120px",
  },
}));

// File Preview Component
const FilePreview = ({
  file,
  onDelete,
  isMobile,
}: {
  file: File | string;
  onDelete?: () => void;
  isMobile: boolean;
}) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (file instanceof File) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    } else if (typeof file === "string") {
      setPreview(file);
    }

    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file, preview]);

  const fileName = file instanceof File ? file.name : "Uploaded file";
  const fileSize =
    file instanceof File ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "";
  const isImage =
    file instanceof File
      ? file.type.startsWith("image/")
      : preview.includes("image");
  const isPDF =
    file instanceof File
      ? file.type === "application/pdf"
      : fileName.toLowerCase().includes(".pdf");

  return (
    <Box
      sx={{
        position: "relative",
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        p: isMobile ? 1.5 : 2,
        bgcolor: "primary.50",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* File Icon/Preview */}
      <Box
        sx={{
          flexShrink: 0,
          width: isMobile ? 60 : 80,
          height: isMobile ? 60 : 80,
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        {isImage && preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Iconify
            icon={isPDF ? "solar:file-text-bold" : "solar:file-bold"}
            width={isMobile ? 24 : 32}
            sx={{ color: "text.secondary" }}
          />
        )}
      </Box>

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0, pr: isMobile ? 4 : 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: isMobile ? "0.875rem" : "0.9rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0.5,
          }}
        >
          {fileName}
        </Typography>
        {fileSize && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.8rem",
              display: "block",
              mb: 0.5,
            }}
          >
            {fileSize}
          </Typography>
        )}
        <Typography
          variant="caption"
          color="success.main"
          sx={{
            display: "block",
            fontSize: isMobile ? "0.75rem" : "0.8rem",
            fontWeight: 500,
          }}
        >
          ✓ File berhasil diupload
        </Typography>
      </Box>

      {/* Delete Button */}
      {onDelete && (
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{
            position: isMobile ? "absolute" : "static",
            top: isMobile ? 8 : "auto",
            right: isMobile ? 8 : "auto",
            bgcolor: "error.main",
            color: "white",
            width: isMobile ? 24 : 32,
            height: isMobile ? 24 : 32,
            "&:hover": {
              bgcolor: "error.dark",
            },
          }}
        >
          <Iconify
            icon="solar:trash-bin-minimalistic-bold"
            width={isMobile ? 14 : 16}
          />
        </IconButton>
      )}
    </Box>
  );
};

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      value,
      onDrop,
      onDelete,
      error,
      helperText,
      multiple = false,
      accept,
      disabled,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (onDrop) {
          onDrop(files);
        }
      },
      [onDrop]
    );

    const hasValue = value && (Array.isArray(value) ? value.length > 0 : true);

    return (
      <Box ref={ref} {...other}>
        {hasValue ? (
          // Show file preview when file is uploaded
          <FilePreview
            file={Array.isArray(value) ? value[0] : value!}
            onDelete={onDelete}
            isMobile={isMobile}
          />
        ) : (
          // Show upload area when no file
          <UploadRoot
            sx={{
              ...(error && {
                borderColor: "error.main",
              }),
              ...(disabled && {
                opacity: 0.5,
                cursor: "not-allowed",
              }),
            }}
          >
            <input
              type="file"
              multiple={multiple}
              accept={accept ? Object.keys(accept).join(",") : undefined}
              onChange={handleFileChange}
              disabled={disabled}
              style={{ display: "none" }}
              id="upload-input"
            />
            <label
              htmlFor="upload-input"
              style={{ cursor: "inherit", display: "block", width: "100%" }}
            >
              <Iconify
                icon="solar:cloud-upload-bold"
                width={isMobile ? 32 : 48}
                sx={{
                  color: "text.secondary",
                  mb: 1,
                }}
              />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                sx={{
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  fontWeight: 500,
                }}
              >
                Seret file ke sini atau klik untuk memilih
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: isMobile ? "0.8rem" : "0.875rem",
                  mb: 2,
                }}
              >
                {multiple ? "Pilih beberapa file" : "Pilih satu file"}
              </Typography>
              <Button
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 0.5 : 1,
                }}
              >
                Pilih File
              </Button>
            </label>
          </UploadRoot>
        )}

        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1.5,
              display: "block",
              textAlign: "center",
              fontSize: isMobile ? "0.75rem" : "0.8rem",
              lineHeight: 1.4,
            }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

Upload.displayName = "Upload";

// ----------------------------------------------------------------------

export const UploadBox = forwardRef<HTMLDivElement, UploadProps>(
  ({ value, onDrop, error, multiple = false, ...other }, ref) => {
    return (
      <Upload
        ref={ref}
        value={value}
        onDrop={onDrop}
        error={error}
        multiple={multiple}
        {...other}
      />
    );
  }
);

UploadBox.displayName = "UploadBox";

// ----------------------------------------------------------------------

export const UploadAvatar = forwardRef<HTMLDivElement, UploadProps>(
  ({ value, onDrop, error, helperText, ...other }, ref) => {
    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (onDrop) {
          onDrop(files);
        }
      },
      [onDrop]
    );

    const getPreviewUrl = () => {
      if (!value) return null;
      if (typeof value === "string") return value;
      if (value instanceof File) return URL.createObjectURL(value);
      return null;
    };

    const previewUrl = getPreviewUrl();

    return (
      <Box ref={ref} {...other}>
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <Avatar
            src={previewUrl || undefined}
            sx={{
              width: 120,
              height: 120,
              border: (theme) =>
                `2px dashed ${
                  error ? theme.palette.error.main : theme.palette.divider
                }`,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            {!previewUrl && <Iconify icon="solar:camera-bold" width={40} />}
          </Avatar>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </Box>

        {helperText && (
          <Typography
            variant="caption"
            color={error ? "error" : "text.secondary"}
            sx={{ mt: 1, display: "block", textAlign: "center" }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

UploadAvatar.displayName = "UploadAvatar";
