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

const updateRequiredFileSchema = z.object({
  nama_berkas: z.string().min(1, "Kode jenjang harus diisi").trim(),
  deskripsi: z.string().min(1, "Nama jenjang harus diisi").trim(),
  wajib: z.boolean(),
});

interface TrackTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: any) => void;
}

export function ListRequiredFilesTableRow({
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
    resolver: zodResolver(updateRequiredFileSchema),
    mode: "onChange",
    defaultValues: {
      nama_berkas: "",
      deskripsi: "",
      wajib: false,
    },
  });

  // Set form values when dialog opens
  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        nama_berkas: row.nama_berkas || "",
        deskripsi: row.deskripsi || "",
        wajib: row.wajib || false,
      };
      form.reset(formValues);
    }
  }, [openDialog.value, row.id_required]);

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
        nama_berkas: data.nama_berkas.trim(),
        deskripsi: data.deskripsi.trim(),
        wajib: data.wajib,
      };

      console.log("Update params:", {
        table: "requiredfile",
        id: row.id_required,
        id_name: "id_required",
        data: dbData,
      });

      await updateData("requiredfile", row.id_required, "id_required", dbData);

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
      console.log("Deleting requiredfile with ID:", row.id_required);
      await deleteData("requiredfile", row.id_required, "id_required");

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
      title="Delete File Wajib"
      content="Apakah Anda yakin ingin menghapus data file wajib ini?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteData}>
          Delete
        </Button>
      }
    />
  );

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={handleCloseDialog}>
      <DialogTitle>Edit File Wajib</DialogTitle>

      <DialogContent>
        <FormProvider {...form}>
          <form
            id="edit-required-file-form"
            onSubmit={form.handleSubmit(handleUpdateData, (errors) => {
              console.log("Form validation errors:", errors);
              showError("Please check form validation errors");
            })}
            noValidate
          >
            <FormField
              control={form.control}
              name="nama_berkas"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nama Berkas"
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
              name="deskripsi"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Deskripsi"
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
              name="wajib"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === true}
                      onChange={(e) =>
                        field.onChange(e.target.checked)
                      }
                    />
                  }
                  label="Wajib"
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
          form="edit-required-file-form"
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
                id: `${row.id_required}-checkbox`,
                "aria-label": `${row.id_required} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_berkas}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.deskripsi}
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
              (row.wajib === true && "success") ||
              (row.wajib === false && "error") ||
              "default"
            }
          >
            {row.wajib ? "Wajib" : "Optional"}
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
