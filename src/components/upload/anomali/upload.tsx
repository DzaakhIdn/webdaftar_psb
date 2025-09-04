import { forwardRef, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

interface UploadProps {
  value?: File | File[] | string;
  onDrop?: (files: File[]) => void;
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
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      value,
      onDrop,
      error,
      helperText,
      multiple = false,
      accept,
      disabled,
      ...other
    },
    ref
  ) => {
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
            style={{ cursor: "inherit", display: "block" }}
          >
            <Typography variant="h6" gutterBottom>
              {hasValue
                ? "File uploaded"
                : "Drop files here or click to browse"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {multiple ? "Select multiple files" : "Select a file"}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Browse Files
            </Button>
          </label>
        </UploadRoot>

        {helperText && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
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
