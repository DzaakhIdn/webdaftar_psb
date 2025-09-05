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

import { updateData } from "@/models";

// ----------------------------------------------------------------------

const updateTemplateSchema = z.object({
  text_name: z.string().min(1, "Nama template harus diisi").trim(),
  template: z.string().min(1, "Template pesan harus diisi").trim(),
});

interface TemplateTableRowProps {
  row: any;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: any) => void;
}

export function TemplateTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: TemplateTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateTemplateSchema),
    mode: "onChange",
    defaultValues: {
      text_name: "",
      template: "",
    },
  });

  useEffect(() => {
    if (openDialog.value && row) {
      const formValues = {
        text_name: row.text_name || "",
        template: row.template || "",
      };
      form.reset(formValues);
    }
  }, [openDialog.value, row.id_text]); // Remove form from dependencies to prevent infinite resets

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
        text_name: data.text_name.trim(),
        template: data.template.trim(),
      };

      console.log("Update params:", {
        table: "text_template",
        id: row.id_text,
        id_name: "id_text",
        data: dbData,
      });

      console.log("Updating with ID:", row.id_text);
      await updateData("text_template", row.id_text, "id_text", dbData);
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
    <Dialog
      open={openDialog.value}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit Template Pesan WhatsApp</DialogTitle>

      <DialogContent>
        <FormProvider {...form}>
          <form
            id="edit-template-form"
            onSubmit={form.handleSubmit(handleUpdateData)}
            noValidate
          >
            <FormField
              control={form.control}
              name="text_name"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Template"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                  placeholder="Contoh: Template Penerimaan"
                />
              )}
            />
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Template Pesan WhatsApp"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Masukkan template pesan WhatsApp di sini...&#10;&#10;Contoh:&#10;Halo {nama_siswa},&#10;&#10;Selamat! Anda telah diterima di sekolah kami.&#10;Password login: {password_hash}&#10;&#10;Terima kasih."
                  helperText="Gunakan {nama_siswa}, {no_daftar}, {jalur}, {password_hash} sebagai placeholder yang akan diganti otomatis"
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
          form="edit-template-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Template"}
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

        <TableCell>{row.text_name}</TableCell>

        <TableCell>
          <ListItemText
            primary={row.template}
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
