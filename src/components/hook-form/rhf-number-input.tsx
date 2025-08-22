import { Controller, useFormContext } from "react-hook-form";

import { NumberInput } from "@/components/number-input";

// ----------------------------------------------------------------------

export function RHFNumberInput({
  name,
  helperText,
  ...other
}: {
  name: string;
  helperText?: string;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <NumberInput
          {...field}
          onChange={({
            event,
            value,
          }: {
            event: React.ChangeEvent<HTMLInputElement>;
            value: number;
          }) => field.onChange(value)}
          {...other}
          error={!!error}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
}
