import { useMemo, forwardRef } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import type { TextFieldProps } from "@mui/material/TextField";
import type { AutocompleteProps } from "@mui/material/Autocomplete";

import { countries } from "@/assets/data/countries";
import { FlagIcon } from "@/components/flag-icon";

// ----------------------------------------------------------------------

interface CountryData {
  code: string;
  label: string;
  phone: string;
}

interface CountrySelectProps
  extends Omit<
    AutocompleteProps<CountryData, false, false, false>,
    "options" | "renderInput"
  > {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  textFieldProps?: TextFieldProps;
}

export const CountrySelect = forwardRef<HTMLDivElement, CountrySelectProps>(
  (
    {
      label,
      placeholder,
      helperText,
      error,
      textFieldProps,
      value,
      onChange,
      ...other
    },
    ref
  ) => {
    const selectedCountry = useMemo(() => {
      if (typeof value === "string") {
        return (
          countries.find(
            (country) => country.code === value || country.label === value
          ) || null
        );
      }
      return value || null;
    }, [value]);

    const handleChange = (event: any, newValue: CountryData | null) => {
      if (onChange) {
        onChange(event, newValue);
      }
    };

    return (
      <Autocomplete
        ref={ref}
        options={countries}
        value={selectedCountry}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        renderOption={(props, option) => (
          <li {...props} key={option.code}>
            <FlagIcon
              code={option.code}
              sx={{ mr: 1, width: 22, height: 22, borderRadius: "50%" }}
            />
            {option.label} ({option.code}) +{option.phone}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedCountry && (
                <FlagIcon
                  code={selectedCountry.code}
                  sx={{ mr: 1, width: 22, height: 22, borderRadius: "50%" }}
                />
              ),
            }}
          />
        )}
        {...other}
      />
    );
  }
);

CountrySelect.displayName = "CountrySelect";
