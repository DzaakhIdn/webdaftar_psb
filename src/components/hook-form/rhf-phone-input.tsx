import { Controller, useFormContext } from "react-hook-form";

import { PhoneInput } from "@/components/phone-input";

// ----------------------------------------------------------------------

export function RHFPhoneInput({
  name,
  helperText,
  ...other
}: {
  name: string;
  helperText?: string;
  label?: string;
  [key: string]: any;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PhoneInput
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
