import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState, useEffect } from "react";

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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// ----------------------------------------------------------------------

interface TrackTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
}

export function ListTrackTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
}: TrackTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  // Form state
  const [formData, setFormData] = useState({
    trackCode: "",
    trackName: "",
    quota: 0,
    status: "aktif" as "aktif" | "nonaktif",
  });

  // Set default values when dialog opens
  useEffect(() => {
    if (openDialog.value && row) {
      setFormData({
        trackCode: row.trackCode || "",
        trackName: row.trackName || "",
        quota: row.quota || 0,
        status: row.status || "aktif",
      });
    }
  }, [openDialog.value, row]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value: any = event.target.value;

      if (event.target.type === "checkbox") {
        // For status field, convert boolean to "aktif"/"nonaktif"
        if (field === "status") {
          value = event.target.checked ? "aktif" : "nonaktif";
        } else {
          value = event.target.checked;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSave = () => {
    // Di sini Anda bisa menambahkan logic untuk menyimpan data
    console.log("Saving data:", formData);
    // Contoh: panggil API untuk update data
    // await updateTrack(row.id, formData);
    openDialog.onFalse();
  };

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
      <DialogTitle>Edit Jalur</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error
          corporis reprehenderit nobis tempore distinctio maiores neque quos
          eius rerum dolore.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Kode Jalur"
          value={formData.trackCode}
          onChange={handleInputChange("trackCode")}
        />
        <TextField
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Nama Jalur"
          value={formData.trackName}
          onChange={handleInputChange("trackName")}
        />
        <TextField
          fullWidth
          type="number"
          margin="dense"
          variant="outlined"
          label="Jumlah Kuota"
          value={formData.quota}
          onChange={handleInputChange("quota")}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.status === "aktif"}
              onChange={handleInputChange("status")}
            />
          }
          label="Aktif"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={openDialog.onFalse} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
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
            primary={row.trackCode}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.trackName}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.quota}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === "aktif" && "success") ||
              (row.status === "nonaktif" && "error") ||
              "default"
            }
          >
            {row.status}
          </Label>
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
