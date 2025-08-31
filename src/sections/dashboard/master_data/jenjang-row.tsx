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
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { updateData, deleteData } from "@/models";

// ----------------------------------------------------------------------

const updateJenjangSchema = z.object({
  kode_jenjang: z.string().min(1, "Kode jenjang harus diisi").trim(),
  nama_jenjang: z.string().min(1, "Nama jenjang harus diisi").trim(),
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

export function ListJenjangTableRow({
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
    resolver: zodResolver(updateJenjangSchema),
    mode: "onChange",
    defaultValues: {
      kode_jenjang: "",
      nama_jenjang: "",
      kuota: 0,
      status: "aktif" as "aktif" | "nonaktif",
    },
  });

  // Set form values when dialog opens
  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        kode_jenjang: row.kode_jenjang || "",
        nama_jenjang: row.nama_jenjang || "",
        kuota: row.kuota || 0,
        status: row.status || "aktif",
      };
      form.reset(formValues);
    }
  }, [openDialog.value, row.id_jenjang]);

  const handleCloseDialog = () => {
    form.reset();
    openDialog.onFalse();
  };

  const handleUpdateData = async () => {
    console.log("handleUpdateData called!");
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = form.getValues();

      console.log("Row data:", row);
      console.log("Form data:", data);

      const dbData = {
        kode_jenjang: data.kode_jenjang.trim(),
        nama_jenjang: data.nama_jenjang.trim(),
        kuota: data.kuota,
        status: data.status || "aktif",
      };

      console.log("Update params:", {
        table: "jenjang",
        id: row.id_jenjang,
        id_name: "id_jenjang",
        data: dbData,
      });

      await updateData("jenjang", row.id_jenjang, "id_jenjang", dbData);

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

  const handleDeleteData = async () => {
    try {
      console.log("Deleting jenjang with ID:", row.id_jenjang);
      await deleteData("jenjang", row.id_jenjang, "id_jenjang");

      showSuccess("Data berhasil dihapus!");
      confirmDialog.onFalse();

      if (onDeleteRow) {
        onDeleteRow();
      }
    } catch (error) {
      console.error("Delete error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Jenjang"
      content="Apakah Anda yakin ingin menghapus data jenjang ini?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteData}>
          Delete
        </Button>
      }
    />
  );

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={handleCloseDialog}>
      <DialogTitle>Edit Jenjang</DialogTitle>

      <DialogContent>
        <FormProvider {...form}>
          <form
            id="edit-jenjang-form"
            onSubmit={form.handleSubmit(handleUpdateData, (errors) => {
              console.log("Form validation errors:", errors);
              showError("Please check form validation errors");
            })}
            noValidate
          >
            <FormField
              control={form.control}
              name="kode_jenjang"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Kode Jenjang"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <FormField
              control={form.control}
              name="nama_jenjang"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nama Jenjang"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <FormField
              control={form.control}
              name="kuota"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Jumlah Kuota"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  type="number"
                  value={field.value?.toString() || "0"}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === "" ? 0 : Number(value);
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    }
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
          form="edit-jenjang-form"
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
                id: `${row.id_jenjang}-checkbox`,
                "aria-label": `${row.id_jenjang} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.kode_jenjang}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_jenjang}
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
