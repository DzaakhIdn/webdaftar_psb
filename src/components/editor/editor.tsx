import { forwardRef, useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

interface EditorProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  resetValue?: boolean;
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ value = '', onChange, resetValue, helperText, error, ...other }, ref) => {
    const [content, setContent] = useState(value);

    useEffect(() => {
      if (resetValue) {
        setContent('');
      }
    }, [resetValue]);

    useEffect(() => {
      setContent(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setContent(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <TextField
        ref={ref}
        multiline
        rows={4}
        value={content}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        placeholder="Enter your content here..."
        {...other}
      />
    );
  }
);

Editor.displayName = 'Editor';
