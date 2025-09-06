import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";

import { RouterLink } from "@/routes/components";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomPopover } from "@/components/custom-popover";

import { UserQuickEditForm } from "./user-quick-edit-form";

// ----------------------------------------------------------------------

interface User {
  id_siswa: string;
  register_id: string;
  nama_lengkap: string;
  no_hp: string;
  files: { nama_berkas: string; path_berkas: string }[];
  status_upload: string;
}

interface UserFilesRowProps {
  row: User;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
}

export function UserFilesRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
}: UserFilesRowProps) {
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id_siswa}-checkbox`,
                "aria-label": `${row.id_siswa} checkbox`,
              },
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          <Stack
            sx={{
              typography: "body2",
              flex: "1 1 auto",
              alignItems: "flex-start",
            }}
          >
            <Link
              component={RouterLink}
              href={editHref}
              color="inherit"
              sx={{ cursor: "pointer" }}
            >
              {row.nama_lengkap}
            </Link>
            <Box component="span" sx={{ color: "text.disabled" }}>
              {row.register_id}
            </Box>
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.no_hp}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status_upload === "Lengkap" && "success") ||
              (row.status_upload === "Sebagian" && "warning") ||
              (row.status_upload === "Belum Upload" && "error") ||
              "default"
            }
          >
            {row.status_upload}
          </Label>
        </TableCell>
        <TableCell>
          {row.files && row.files.length > 0 ? (
            row.files.map((file, idx: number) => (
              <div key={idx}>
                <Link
                  href={file.path_berkas}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  {file.nama_berkas}
                </Link>
              </div>
            ))
          ) : (
            <span style={{ color: "gray" }}>Belum upload</span>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
