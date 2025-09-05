import { Controller, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";

import { HelperText } from "./help-text";
import { Upload, UploadBox, UploadAvatar } from "../upload/anomali/upload";

// ----------------------------------------------------------------------

interface RHFUploadAvatarProps {
  name: string;
  slotProps?: {
    wrapper?: React.ComponentProps<typeof Box>;
  };
  [key: string]: any;
}

export function RHFUploadAvatar({
  name,
  slotProps,
  ...other
}: RHFUploadAvatarProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar
              value={field.value}
              error={!!error}
              onDrop={onDrop}
              {...other}
            />

            <HelperText
              errorMessage={error?.message}
              helperText=""
              disableGutters={false}
              sx={{ textAlign: "center" }}
            />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFUploadBoxProps {
  name: string;
  [key: string]: any;
}

export function RHFUploadBox({ name, ...other }: RHFUploadBoxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFUploadProps {
  name: string;
  multiple?: boolean;
  helperText?: string;
  maxSize?: number;
  [key: string]: any;
}

export function RHFUpload({
  name,
  multiple,
  helperText,
  maxSize = 5242880, // 5MB default
  ...other
}: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { "image/*": [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          // Validate file size
          const validFiles = acceptedFiles.filter((file) => {
            if (file.size > maxSize) {
              // You could show a toast error here
              console.error(
                `File ${file.name} is too large. Maximum size is ${
                  maxSize / 1024 / 1024
                }MB`
              );
              return false;
            }
            return true;
          });

          if (validFiles.length === 0) return;

          const value = multiple
            ? [...(field.value || []), ...validFiles]
            : validFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        const onDelete = () => {
          setValue(name, multiple ? [] : null, { shouldValidate: true });
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            onDelete={onDelete}
            {...other}
          />
        );
      }}
    />
  );
}
