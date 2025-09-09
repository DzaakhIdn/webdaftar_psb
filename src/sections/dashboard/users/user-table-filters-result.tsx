import { useCallback } from "react";

import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";

import {
  chipProps,
  FiltersBlock,
  FiltersResult,
} from "@/components/filters-result";

// ----------------------------------------------------------------------

interface UserFiltersState {
  name: string;
  jalur: number[];
  status: string;
}

interface UserFilters {
  state: UserFiltersState;
  setState: (newState: Partial<UserFiltersState>) => void;
  resetState: () => void;
}

interface UserTableFiltersResultProps {
  filters: UserFilters;
  onResetPage: () => void;
  totalResults: number;
  jalurOptions?: {
    id_jalur_final: number;
    nama_jalur_final: string;
    jenis_kelamin: string;
  }[];
  sx?: SxProps<Theme>;
}

export function UserTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  jalurOptions = [],
  sx,
}: UserTableFiltersResultProps) {
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: "" });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: "all" });
  }, [onResetPage, updateFilters]);

  const handleRemoveJalur = useCallback(
    (inputValue: number) => {
      const newValue = currentFilters.jalur.filter(
        (item) => item !== inputValue
      );

      onResetPage();
      updateFilters({ jalur: newValue });
    },
    [onResetPage, updateFilters, currentFilters.jalur]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== "all"}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: "capitalize" }}
        />
      </FiltersBlock>

      <FiltersBlock label="Jalur Final:" isShow={!!currentFilters.jalur.length}>
        {currentFilters.jalur.map((item) => {
          const jalur = jalurOptions.find((j) => j.id_jalur_final === item);
          const displayName = jalur ? jalur.nama_jalur_final : item;
          return (
            <Chip
              {...chipProps}
              key={item}
              label={displayName}
              onDelete={() => handleRemoveJalur(item)}
            />
          );
        })}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip
          {...chipProps}
          label={currentFilters.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
