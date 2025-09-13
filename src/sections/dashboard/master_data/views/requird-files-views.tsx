"use client";

import { useState, useCallback, useEffect } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { z } from "zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

import Grid from "@mui/material/GridLegacy";
import Typography from "@mui/material/Typography";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { DashboardContent } from "@/layout/dashboard";
import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";

import { Pagination } from "@mui/material";
import { TrackTableToolbar } from "../track-table-toolbar";
import { TrackTableFiltersResult } from "../track-table-filters-result";
import { _jenjang } from "@/_mock/_invoice";
import { paths } from "@/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { insertData, showAllData, updateData, deleteData } from "@/models";
import { useToast } from "@/components/providers/toast-provider";
import {
  uploadFileRequiredExample,
  deleteFileRequiredExample,
} from "@/models/upload-file-required-example";
import { Upload } from "@/components/upload";

// =======================================================================

// Required File Card Component
interface RequiredFileCardProps {
  file: RequiredFile;
  onDelete: () => void;
  onUpdate: (updatedData: Partial<RequiredFile>) => void;
}

function RequiredFileCard({ file, onDelete, onUpdate }: RequiredFileCardProps) {
  const confirmDialog = useBoolean();
  const openEditDialog = useBoolean();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const editForm = useForm({
    resolver: zodResolver(createJenjang),
    defaultValues: {
      nama_berkas: file.nama_berkas || "",
      deskripsi: file.deskripsi || "",
      wajib: file.wajib || false,
      contoh_file: file.contoh_file || "",
    },
  });

  // Set form values when dialog opens
  useEffect(() => {
    if (openEditDialog.value && file) {
      editForm.reset({
        nama_berkas: file.nama_berkas || "",
        deskripsi: file.deskripsi || "",
        wajib: file.wajib || false,
        contoh_file: file.contoh_file || "",
      });
    }
  }, [openEditDialog.value, file.id_required]);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpdateData = async (data: z.infer<typeof createJenjang>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setUploadingFile(true);
    try {
      let contohFileUrl = data.contoh_file || "";

      // Upload new file if selected
      if (selectedFile) {
        // Delete old file if exists
        if (file.contoh_file) {
          try {
            const url = new URL(file.contoh_file);
            const pathParts = url.pathname.split("/");
            const bucketIndex = pathParts.indexOf("file-required");
            if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
              const storagePath = pathParts.slice(bucketIndex + 1).join("/");
              await deleteFileRequiredExample(storagePath);
            }
          } catch (error) {
            console.error("Error deleting old file:", error);
          }
        }

        const uploadResult = await uploadFileRequiredExample(
          selectedFile,
          file.id_required,
          data.nama_berkas
        );
        contohFileUrl = uploadResult.path_berkas;
      }

      const dbData = {
        nama_berkas: data.nama_berkas.trim(),
        deskripsi: data.deskripsi.trim(),
        wajib: data.wajib,
        contoh_file: contohFileUrl,
      };

      await updateData("requiredfile", file.id_required, "id_required", dbData);

      onUpdate(dbData);
      showSuccess("Data berhasil diubah!");
      openEditDialog.onFalse();
      setSelectedFile(null);
    } catch (error) {
      console.error("Update error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
      setUploadingFile(false);
    }
  };

  const handleDeleteData = async () => {
    try {
      // Delete file from storage if exists
      if (file.contoh_file) {
        try {
          const url = new URL(file.contoh_file);
          const pathParts = url.pathname.split("/");
          const bucketIndex = pathParts.indexOf("file-required");
          if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
            const storagePath = pathParts.slice(bucketIndex + 1).join("/");
            await deleteFileRequiredExample(storagePath);
          }
        } catch (error) {
          console.error("Error deleting file from storage:", error);
        }
      }

      await deleteData("requiredfile", "id_required", file.id_required);
      showSuccess("Data berhasil dihapus!");
      confirmDialog.onFalse();
      onDelete();
    } catch (error) {
      console.error("Delete error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Image/Preview */}
        <Box
          sx={{
            height: 200,
            position: "relative",
            overflow: "hidden",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {file.contoh_file ? (
            <Box
              component="img"
              src={file.contoh_file}
              alt={file.nama_berkas}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Show fallback icon
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #9e9e9e;">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <Iconify
              icon="solar:file-bold-duotone"
              width={64}
              sx={{ color: "text.secondary" }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom noWrap>
            {file.nama_berkas}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {file.deskripsi}
          </Typography>
          <Label
            variant="soft"
            color={file.wajib ? "success" : "warning"}
            sx={{ mb: 1 }}
          >
            {file.wajib ? "Wajib" : "Optional"}
          </Label>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={confirmDialog.onTrue}
          >
            Hapus
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={openEditDialog.onTrue}
          >
            Edit
          </Button>
        </CardActions>
      </Card>

      {/* Confirm Delete Dialog */}
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

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog.value}
        onClose={openEditDialog.onFalse}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit File Wajib</DialogTitle>
        <DialogContent>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateData)}>
              <FormField
                control={editForm.control}
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
                control={editForm.control}
                name="deskripsi"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Deskripsi"
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
                control={editForm.control}
                name="wajib"
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="File Wajib"
                    sx={{ mt: 1, mb: 1 }}
                  />
                )}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Contoh File Baru (Opsional)
                </Typography>
                <Upload
                  multiple={false}
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
                    "application/pdf": [".pdf"],
                  }}
                  onDrop={handleFileUpload}
                  onDelete={() => setSelectedFile(null)}
                  value={selectedFile || undefined}
                  helperText="Upload gambar contoh atau PDF baru untuk mengganti file yang ada"
                />
                {file.contoh_file && !selectedFile && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    File saat ini: {file.contoh_file.split("/").pop()}
                  </Typography>
                )}
              </Box>

              <DialogActions>
                <Button
                  onClick={() => {
                    openEditDialog.onFalse();
                    setSelectedFile(null);
                    editForm.reset();
                  }}
                  variant="outlined"
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || uploadingFile}
                >
                  {uploadingFile ? "Menyimpan..." : "Save"}
                </Button>
              </DialogActions>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// =======================================================================

interface RequiredFile {
  id_required: string;
  nama_berkas: string;
  deskripsi: string;
  wajib: boolean;
  contoh_file?: string;
}

const createJenjang = z.object({
  nama_berkas: z.string().min(1, "Nama berkas harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi harus diisi"),
  wajib: z.boolean(),
  contoh_file: z.string().optional(),
});

// =======================================================================

export function ListRequiredFilesView() {
  const [tableData, setTableData] = useState<RequiredFile[]>([]);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { showSuccess, showError } = useToast();
  const itemsPerPage = 12;

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await showAllData("requiredfile");
        setTableData(data as RequiredFile[]);
      } catch (error) {
        console.error("Error loading required files data:", error);
        showError("Failed to load required files data");
      }
    };

    loadData();
  }, [showError]);

  const filtersState = useSetState({
    name: "",
    role: [] as string[],
    status: "all",
  });
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filtersState;

  const filters = {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: (a, b) => a.nama_berkas.localeCompare(b.nama_berkas),
  });

  const totalPages = Math.ceil(dataFiltered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const dataInPage = dataFiltered.slice(startIndex, startIndex + itemsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all";

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id_required !== id);
      setTableData(deleteRow);
    },
    [tableData]
  );
  const openDialog = useBoolean();
  const form = useForm({
    resolver: zodResolver(createJenjang),
    defaultValues: {
      nama_berkas: "",
      deskripsi: "",
      wajib: true,
      contoh_file: "",
    },
  });

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleAddData = async (data: z.infer<typeof createJenjang>) => {
    try {
      setUploadingFile(true);
      console.log("Attempting to insert data:", data);

      let contohFileUrl = "";

      // Upload file if selected
      if (selectedFile) {
        const uploadResult = await uploadFileRequiredExample(
          selectedFile,
          Date.now().toString(), // temporary ID
          data.nama_berkas
        );
        contohFileUrl = uploadResult.path_berkas;
      }

      const dataToInsert = {
        nama_berkas: data.nama_berkas.trim(),
        deskripsi: data.deskripsi.trim(),
        wajib: data.wajib,
        contoh_file: contohFileUrl,
      };

      await insertData("requiredfile", dataToInsert);

      showSuccess("Data berhasil ditambahkan!");
      form.reset();
      setSelectedFile(null);
      openDialog.onFalse();

      // Reload data
      const newData = await showAllData("requiredfile");
      setTableData(newData as RequiredFile[]);
    } catch (error) {
      console.error("Insert error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUploadingFile(false);
    }
  };
  const renderFormDialog = () => (
    <Dialog
      open={openDialog.value}
      onClose={openDialog.onFalse}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Tambah File Wajib</DialogTitle>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddData)}>
            <FormField
              control={form.control}
              name="nama_berkas"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Berkas"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            />
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Deskripsi"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
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
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="File Wajib"
                  sx={{ mt: 1, mb: 1 }}
                />
              )}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Upload Contoh File (Opsional)
              </Typography>
              <Upload
                multiple={false}
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".gif"],
                  "application/pdf": [".pdf"],
                }}
                onDrop={handleFileUpload}
                onDelete={() => setSelectedFile(null)}
                value={selectedFile || undefined}
                helperText="Upload gambar contoh atau PDF untuk membantu siswa memahami format file yang dibutuhkan"
              />
            </Box>

            <DialogActions>
              <Button
                onClick={() => {
                  openDialog.onFalse();
                  setSelectedFile(null);
                  form.reset();
                }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploadingFile}
              >
                {uploadingFile ? "Menyimpan..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <DashboardContent
        sx={{
          borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
          pt: 3,
          mb: { xs: 3, md: 5 },
        }}
      >
        <CustomBreadcrumbs
          heading="List File Wajib"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Master Data", href: paths.dashboard.finance.root },
            { name: "List File Wajib" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              File Wajib Baru
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Search and Filter */}
        <Card sx={{ p: 2, mb: 3 }}>
          <TrackTableToolbar
            filters={filters}
            onResetPage={() => setPage(1)}
            options={{ services: [] }}
          />

          {canReset && (
            <TrackTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={() => setPage(1)}
              sx={{ pt: 0 }}
            />
          )}
        </Card>

        {/* Cards Grid */}
        {notFound ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Iconify
              icon="solar:inbox-bold-duotone"
              width={64}
              color="text.disabled"
            />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Tidak ada data file wajib
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {canReset
                ? "Tidak ada data yang sesuai dengan filter"
                : "Belum ada file wajib yang terdaftar"}
            </Typography>
          </Card>
        ) : (
          <>
            <Grid container spacing={3}>
              {dataInPage.map((file) => (
                <Grid item xs={12} sm={6} md={4} key={file.id_required}>
                  <RequiredFileCard
                    file={file}
                    onDelete={() => handleDeleteRow(file.id_required)}
                    onUpdate={(updatedData) => {
                      setTableData((prev) =>
                        prev.map((item) =>
                          item.id_required === file.id_required
                            ? { ...item, ...updatedData }
                            : item
                        )
                      );
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </DashboardContent>
      {renderFormDialog()}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: RequiredFile[];
  comparator: (a: RequiredFile, b: RequiredFile) => number;
}): RequiredFile[] {
  const stabilizedThis: [RequiredFile, number][] = inputData.map(
    (el, index) => [el, index]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  const filteredData: RequiredFile[] = stabilizedThis.map((el) => el[0]);

  return filteredData;
}
