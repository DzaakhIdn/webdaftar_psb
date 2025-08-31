import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/providers/toast-provider";
import { FormField } from "@/components/ui/form";

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
import { updateData } from "@/models";

// ----------------------------------------------------------------------

const updateJalurSchema = z.object({
  kode_jalur: z.string().min(1, "Kode jalur harus diisi").trim(),
  nama_jalur: z.string().min(1, "Nama jalur harus diisi").trim(),
  kuota: z
    .number()
    .int("Kuota harus berupa bilangan bulat")
    .min(0, "Kuota tidak boleh negatif"),
  status: z.enum(["aktif", "nonaktif"]),
});

interface TrackTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: any) => void;
}

export function ListTrackTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: TrackTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateJalurSchema),
    mode: "onChange",
    defaultValues: {
      kode_jalur: "",
      nama_jalur: "",
      kuota: 0,
      status: "aktif" as "aktif" | "nonaktif",
    },
  });

  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        kode_jalur: row.kode_jalur || "",
        nama_jalur: row.nama_jalur || "",
        kuota: row.kuota || 0,
        status: row.status || "aktif",
      };
      form.reset(formValues);
    }
  }, [openDialog.value, row.id_jalur]); // Remove form from dependencies to prevent infinite resets

  const handleCloseDialog = () => {
    form.reset();
    openDialog.onFalse();
  };

  const handleUpdateData = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = form.getValues();

      console.log("Row data:", row);
      console.log("Form data:", data);

      const dbData = {
        kode_jalur: data.kode_jalur.trim(),
        nama_jalur: data.nama_jalur.trim(),
        kuota: data.kuota,
        status: data.status || "aktif",
      };

      console.log("Update params:", {
        table: "jalur",
        id: row.id_jalur,
        id_name: "id_jalur",
        data: dbData,
      });

      console.log("Updating with ID:", row.id_jalur);
      await updateData("jalur", row.id_jalur, "id_jalur", dbData);
      if (onUpdateRow) {
        onUpdateRow(dbData);
      }
      showSuccess("Data berhasil diubah!");
      handleCloseDialog();
    } catch (error) {
      console.error("Update error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
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
    <Dialog open={openDialog.value} onClose={handleCloseDialog}>
      <DialogTitle>Edit Jalur</DialogTitle>

      <DialogContent>
        <FormProvider {...form}>
          <form
            id="edit-jalur-form"
            onSubmit={form.handleSubmit(handleUpdateData)}
            noValidate
          >
            <FormField
              control={form.control}
              name="kode_jalur"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kode Jalur"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            />
            <FormField
              control={form.control}
              name="nama_jalur"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Jalur"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              )}
            />
            <FormField
              control={form.control}
              name="kuota"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Jumlah Kuota"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : parseInt(value) || 0);
                  }}
                />
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === "aktif"}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "aktif" : "nonaktif")
                      }
                    />
                  }
                  label="Aktif"
                />
              )}
            />
          </form>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          form="edit-jalur-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
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
                id: `${row.id_jalur}-checkbox`,
                "aria-label": `${row.id_jalur} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.kode_jalur}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_jalur}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.kuota}
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
