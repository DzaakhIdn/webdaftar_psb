import { useDropzone } from "react-dropzone";
import { varAlpha, mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import { SxProps, Theme } from "@mui/material/styles";

import { Iconify } from "@/components/iconify";
import { uploadClasses } from "./classes";
import { UploadPlaceholder } from "./components/placeholder";
import { RejectionFiles } from "./components/rejection-files";
import {
  DeleteButton,
  SingleFilePreview,
} from "./components/preview-single-file";

// ----------------------------------------------------------------------

interface UploadProps {
  sx?: SxProps<Theme>;
  value?: File | File[] | string;
  error?: boolean;
  disabled?: boolean;
  onDelete?: () => void;
  onUpload?: (files: File[]) => void;
  onRemove?: (file: File | string) => void;
  thumbnail?: boolean;
  helperText?: string;
  onRemoveAll?: () => void;
  className?: string;
  multiple?: boolean;
  [key: string]: any;
}

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  className,
  multiple = false,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;
  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  return (
    <Box
      className={mergeClasses([uploadClasses.upload, className])}
      sx={{ width: 1, position: "relative", ...sx }}
    >
      <Box
        {...getRootProps()}
        sx={[
          (theme) => ({
            p: 5,
            outline: "none",
            borderRadius: 1,
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
            border: `1px dashed ${varAlpha(
              theme.vars.palette.grey["500Channel"],
              0.2
            )}`,
            transition: theme.transitions.create(["opacity", "padding"]),
            "&:hover": { opacity: 0.72 },
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: "none" }),
            ...(hasError && {
              color: "error.main",
              borderColor: "error.main",
              bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            ...(hasFile && { padding: "28% 0" }),
          }),
        ]}
      >
        <input {...getInputProps()} />

        {/* Single file */}
        {hasFile ? (
          <SingleFilePreview
            file={value as File | string}
            sx={undefined}
            className={undefined}
          />
        ) : (
          <UploadPlaceholder sx={undefined} className={undefined} />
        )}
      </Box>

      {/* Single file */}
      {hasFile && <DeleteButton onClick={onDelete} sx={undefined} />}

      {helperText && (
        <FormHelperText error={!!error} sx={{ mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}

      {!!fileRejections.length && (
        <RejectionFiles
          files={[...fileRejections]}
          sx={undefined}
          className={undefined}
        />
      )}
    </Box>
  );
}
