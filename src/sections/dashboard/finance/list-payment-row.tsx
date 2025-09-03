import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateData, showAllData } from "@/models";
import { useToast } from "@/components/providers/toast-provider";
import { Form, FormField } from "@/components/ui/form";

// ----------------------------------------------------------------------

interface InvoiceTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: any) => void;
}

const updateBiayaSchema = z.object({
  kode_biaya: z.string().min(1, "Kode Pembayaran is required"),
  nama_biaya: z.string().min(1, "Nama Pembayaran is required"),
  jumlah: z.number().min(1, "Jumlah Biaya is required"),
  status_biaya: z.enum(["wajib", "optional"]),
});

export function ListPaymentTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: InvoiceTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateBiayaSchema),
    defaultValues: {
      kode_biaya: "",
      nama_biaya: "",
      jumlah: 0,
      status_biaya: "wajib" as "wajib" | "optional",
    },
  });

  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        kode_biaya: row.kode_biaya || "",
        nama_biaya: row.nama_biaya || "",
        jumlah: row.jumlah || 0,
        status_biaya: row.status_biaya || "wajib",
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
        kode_biaya: data.kode_biaya.trim(),
        nama_biaya: data.nama_biaya.trim(),
        jumlah: data.jumlah,
        status_biaya: data.status_biaya,
      };

      // console.log("Update params:", {
      //   table: "biaya",
      //   id: row.id_biaya,
      //   id_name: "id_biaya",
      //   data: dbData,
      // });

      // console.log("Updating with ID:", row.id_biaya);
      await updateData("biaya", row.id_biaya, "id_biaya", dbData);
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
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Tambah Pembayaran</DialogTitle>

      <DialogContent>
        <Form {...form}>
          <form action="#" onSubmit={form.handleSubmit(handleUpdateData)}>
            <FormField
              control={form.control}
              name="kode_biaya"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kode Pembayaran"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="nama_biaya"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Pembayaran"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Jumlah Biaya"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  type="number"
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="status_biaya"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === "wajib"}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "wajib" : "optional")
                      }
                    />
                  }
                  label="Wajib"
                />
              )}
            ></FormField>
            <DialogActions>
              <Button
                onClick={openDialog.onFalse}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={openDialog.onFalse}
                variant="contained"
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Form>
      </DialogContent>
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
            primary={row.kode_biaya}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_biaya}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.jumlah}
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
              (row.status_biaya === "wajib" && "error") ||
              (row.status_biaya === "optional" && "warning") ||
              "default"
            }
          >
            {row.status_biaya}
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
