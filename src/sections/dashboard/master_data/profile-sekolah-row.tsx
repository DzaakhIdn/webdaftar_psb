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
import { updateData, deleteData } from "@/models";

// ----------------------------------------------------------------------

const updateProfileSekolahSchema = z.object({
  npsn: z.string().min(1, "NPSN harus diisi").trim(),
  nama_sekolah: z.string().min(1, "Nama sekolah harus diisi").trim(),
  alamat_sekolah: z.string().min(1, "Alamat sekolah harus diisi").trim(),
  no_telp: z.string().min(1, "No telepon harus diisi").trim(),
});

interface TrackTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: any) => void;
}

export function ListProfileSekolahTableRow({
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
    resolver: zodResolver(updateProfileSekolahSchema),
    mode: "onChange",
    defaultValues: {
      npsn: "",
      nama_sekolah: "",
      alamat_sekolah: "",
      no_telp: "",
    },
  });

  // Set form values when dialog opens
  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        npsn: row.npsn || "",
        nama_sekolah: row.nama_sekolah || "",
        alamat_sekolah: row.alamat_sekolah || "",
        no_telp: row.no_telp || "",
      };
      form.reset(formValues);
    }
  }, [openDialog.value, row.id]);

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
        npsn: data.npsn.trim(),
        nama_sekolah: data.nama_sekolah.trim(),
        alamat_sekolah: data.alamat_sekolah.trim(),
        no_telp: data.no_telp.trim(),
      };

      console.log("Update params:", {
        table: "profile_sekolah",
        id: row.id,
        id_name: "id",
        data: dbData,
      });

      await updateData("profile_sekolah", row.id, "id", dbData);

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
      console.log("Full row data:", row);
      console.log("Deleting profile sekolah with ID:", row.id);
      console.log("Delete params:", {
        table: "profile_sekolah",
        id_name: "id",
        id: row.id,
      });

      await deleteData("profile_sekolah", "id", row.id);

      showSuccess("Data berhasil dihapus!");
      confirmDialog.onFalse();

      if (onDeleteRow) {
        onDeleteRow();
      }
    } catch (error) {
      console.error("Delete error:", error);
      console.error("Error details:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Profile Sekolah"
      content="Apakah Anda yakin ingin menghapus data profile sekolah ini?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteData}>
          Delete
        </Button>
      }
    />
  );

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={handleCloseDialog}>
      <DialogTitle>Edit Profile Sekolah</DialogTitle>

      <DialogContent>
        <FormProvider {...form}>
          <form
            id="edit-profile-sekolah-form"
            onSubmit={form.handleSubmit(handleUpdateData, (errors) => {
              console.log("Form validation errors:", errors);
              showError("Please check form validation errors");
            })}
            noValidate
          >
            <FormField
              control={form.control}
              name="npsn"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="NPSN"
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
              name="nama_sekolah"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Nama Sekolah"
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
              name="alamat_sekolah"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Alamat Sekolah"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <FormField
              control={form.control}
              name="no_telp"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="No Telepon"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
          form="edit-profile-sekolah-form"
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
                id: `${row.id}-checkbox`,
                "aria-label": `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.npsn}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_sekolah}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.alamat_sekolah}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.no_telp}
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
