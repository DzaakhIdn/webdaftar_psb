import { useCallback } from "react";
import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "@/components/iconify";
import { CustomPopover } from "@/components/custom-popover";

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

interface UserTableToolbarProps {
  filters: UserFilters;
  options: {
    jalur: {
      id_jalur_final: number;
      nama_jalur_final: string;
      jenis_kelamin: string;
    }[];
  };
  onResetPage: () => void;
}

export function UserTableToolbar({
  filters,
  options,
  onResetPage,
}: UserTableToolbarProps) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterJalur = useCallback(
    (event: SelectChangeEvent<number[]>) => {
      const newValue =
        typeof event.target.value === "string"
          ? event.target.value.split(",").map(Number)
          : event.target.value;

      onResetPage();
      updateFilters({ jalur: newValue });
    },
    [onResetPage, updateFilters]
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: "flex",
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-end", md: "center" },
        }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="filter-jalur-select">Jalur</InputLabel>
          <Select
            multiple
            value={currentFilters.jalur}
            onChange={handleFilterJalur}
            input={<OutlinedInput label="Jalur" />}
            renderValue={(selected) =>
              selected
                .map((value) => {
                  const jalur = options.jalur.find(
                    (j) => j.id_jalur_final === value
                  );
                  return jalur ? jalur.nama_jalur_final : value;
                })
                .join(", ")
            }
            inputProps={{ id: "filter-jalur-select" }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.jalur && options.jalur.length > 0 ? (
              options.jalur.map((option) => (
                <MenuItem
                  key={option.id_jalur_final}
                  value={option.id_jalur_final}
                >
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={currentFilters.jalur.includes(
                      option.id_jalur_final
                    )}
                  />
                  {option.nama_jalur_final}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                <em>Loading jalur final...</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}
