import { forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

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
  textAlign: 'center',
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'background-color']),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  ({ value, onDrop, error, helperText, multiple = false, accept, disabled, ...other }, ref) => {
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
              borderColor: 'error.main',
            }),
            ...(disabled && {
              opacity: 0.5,
              cursor: 'not-allowed',
            }),
          }}
        >
          <input
            type="file"
            multiple={multiple}
            accept={accept ? Object.keys(accept).join(',') : undefined}
            onChange={handleFileChange}
            disabled={disabled}
            style={{ display: 'none' }}
            id="upload-input"
          />
          <label htmlFor="upload-input" style={{ cursor: 'inherit', display: 'block' }}>
            <Typography variant="h6" gutterBottom>
              {hasValue ? 'File uploaded' : 'Drop files here or click to browse'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {multiple ? 'Select multiple files' : 'Select a file'}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Browse Files
            </Button>
          </label>
        </UploadRoot>
        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ mt: 1, display: 'block' }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

Upload.displayName = 'Upload';

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

UploadBox.displayName = 'UploadBox';

// ----------------------------------------------------------------------

export const UploadAvatar = forwardRef<HTMLDivElement, UploadProps>(
  ({ value, onDrop, error, ...other }, ref) => {
    return (
      <Upload
        ref={ref}
        value={value}
        onDrop={onDrop}
        error={error}
        multiple={false}
        accept={{ 'image/*': [] }}
        {...other}
      />
    );
  }
);

UploadAvatar.displayName = 'UploadAvatar';
