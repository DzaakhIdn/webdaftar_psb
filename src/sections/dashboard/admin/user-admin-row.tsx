import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { EditUserDialog } from "./edit-user-dialog";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// ----------------------------------------------------------------------

interface InvoiceTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onRefresh?: () => void;
}

export function ListUserAdminTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onRefresh,
}: InvoiceTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  const renderFormDialog = () => (
    <EditUserDialog
      open={openDialog.value}
      onClose={openDialog.onFalse}
      user={row}
      onSuccess={() => {
        openDialog.onFalse();
        // Trigger parent refresh
        if (onRefresh) {
          onRefresh();
        }
      }}
    />
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                "aria-label": `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.username}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_lengkap || row.name}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.role || row.level}
            secondary={
              row.password_hash
                ? (() => {
                    try {
                      return `${atob(row.password_hash)}`;
                    } catch (error) {
                      console.error("Error decoding password:", error);
                      return "Password: [Error decoding]";
                    }
                  })()
                : "No password"
            }
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: {
                sx: { mt: 0.5, typography: "caption", color: "text.secondary" },
              },
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {row.phone_numbers && row.phone_numbers.length > 0 ? (
              row.phone_numbers.map((phone: any, index: number) => (
                <Box
                  key={phone.id_nomor || index}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Label variant="soft" color="info" size="small">
                    {phone.nama_nomor}
                  </Label>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {phone.nomor_hp}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="caption"
                sx={{ color: "text.disabled", fontStyle: "italic" }}
              >
                Tidak ada nomor HP
              </Typography>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton
                color={confirmDialog.value ? "inherit" : "error"}
                onClick={confirmDialog.onTrue}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color={openDialog.value ? "inherit" : "info"}
                onClick={openDialog.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {renderConfirmDialog()}
      {renderFormDialog()}
    </>
  );
}
