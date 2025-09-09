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
}

export function ListNoHpTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
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
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Edit Pembayaran</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error
          corporis reprehenderit nobis tempore distinctio maiores neque quos
          eius rerum dolore.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          type="email"
          margin="dense"
          variant="outlined"
          label="Pembayaran"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={openDialog.onFalse} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={openDialog.onFalse} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
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
            primary={row.nama_nomor}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nomor_hp}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
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
