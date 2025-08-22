import { parsePhoneNumber } from "react-phone-number-input";
import PhoneNumberInput from "react-phone-number-input/input";
import type {
  Value as E164Number,
  Country,
  DefaultInputComponentProps,
} from "react-phone-number-input";
import {
  useState,
  useEffect,
  useCallback,
  startTransition,
  forwardRef,
} from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";
import type { SxProps, Theme } from "@mui/material/styles";

import { countries } from "@/assets/data/countries";

import { Iconify } from "../iconify";
import { CountryListPopover } from "./list-popover";

// ----------------------------------------------------------------------

interface PhoneInputProps {
  sx?: SxProps<Theme> | SxProps<Theme>[];
  size?: "small" | "medium";
  value: string;
  label?: string;
  onChange: (value?: E164Number) => void;
  placeholder?: string;
  disableSelect?: boolean;
  variant?: "outlined" | "filled" | "standard";
  country?: Country;
  [key: string]: any;
}

export function PhoneInput({
  sx,
  size,
  value,
  label,
  onChange,
  placeholder,
  disableSelect,
  variant = "outlined",
  country: inputCountryCode,
  ...other
}: PhoneInputProps) {
  const defaultCountryCode = getCountryCode(value, inputCountryCode);

  const [searchCountry, setSearchCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);

  const hasLabel = !!label;

  const cleanValue = value.replace(/[\s-]+/g, "");

  const handleClear = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry(defaultCountryCode);
    }
  }, [defaultCountryCode, selectedCountry]);

  const handleClickCountry = (inputValue: Country) => {
    startTransition(() => {
      setSelectedCountry(inputValue);
    });
  };

  const handleSearchCountry = (inputValue: string) => {
    setSearchCountry(inputValue);
  };

  return (
    <Box
      sx={
        [
          {
            "--popover-button-mr": "12px",
            "--popover-button-height": "22px",
            "--popover-button-width": variant === "standard" ? "48px" : "60px",
            position: "relative",
            ...(!disableSelect && {
              [`& .${inputBaseClasses.input}`]: {
                pl: "calc(var(--popover-button-width) + var(--popover-button-mr))",
              },
            }),
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ] as SxProps<Theme>
      }
    >
      {!disableSelect && (
        <CountryListPopover
          countries={countries}
          searchCountry={searchCountry}
          countryCode={selectedCountry}
          onClickCountry={handleClickCountry}
          onSearchCountry={handleSearchCountry}
          sx={{
            pl: variant === "standard" ? 0 : 1.5,
            ...(variant === "standard" &&
              hasLabel && { mt: size === "small" ? "16px" : "20px" }),
            ...((variant === "filled" || variant === "outlined") && {
              mt: size === "small" ? "8px" : "16px",
            }),
            ...(variant === "filled" &&
              hasLabel && { mt: size === "small" ? "21px" : "25px" }),
          }}
        />
      )}

      <PhoneNumberInput
        size={size}
        label={label}
        value={cleanValue}
        variant={variant}
        onChange={onChange}
        hiddenLabel={!label}
        country={selectedCountry}
        inputComponent={CustomInput}
        placeholder={placeholder ?? "Enter phone number"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: cleanValue && (
              <InputAdornment position="end">
                <IconButton size="small" edge="end" onClick={handleClear}>
                  <Iconify width={16} icon="mingcute:close-line" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...other}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

const CustomInput = forwardRef<HTMLInputElement, DefaultInputComponentProps>(
  (props, ref) => {
    return <TextField inputRef={ref} {...props} />;
  }
);

// ----------------------------------------------------------------------

function getCountryCode(
  inputValue: string,
  countryCode?: Country
): Country | undefined {
  if (inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);
    return phoneNumber?.country;
  }

  return countryCode;
}
