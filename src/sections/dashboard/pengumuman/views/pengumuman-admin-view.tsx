"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DashboardContent } from "@/layout/dashboard";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { useTable, getComparator } from "@/components/table";
import {
  TableHeadCustom,
  TableSelectedAction,
  useTable as useTableHook,
} from "@/components/table";
import { useBoolean } from "minimal-shared/hooks";
import { useToast } from "@/components/providers/toast-provider";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/paths";

import {
  Pengumuman,
  CreatePengumumanData,
  getAllPengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  getPengumumanTypeConfig,
  formatTanggalPengumuman,
} from "@/models/pengumuman-service";

import { PengumumanTableRow } from "../pengumuman-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "judul", label: "Judul", width: 250 },
  { id: "tipe", label: "Tipe", width: 120 },
  { id: "status", label: "Status", width: 100 },
  { id: "target_audience", label: "Target", width: 120 },
  { id: "prioritas", label: "Prioritas", width: 100 },
  { id: "tanggal_berakhir", label: "Berakhir", width: 150 },
  { id: "actions", label: "", width: 100 },
];

const pengumumanSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul harus diisi")
    .max(200, "Judul maksimal 200 karakter"),
  konten: z.string().min(1, "Konten harus diisi"),
  tipe: z.enum(["info", "penting", "urgent", "sukses", "peringatan"]),
  status: z.enum(["aktif", "nonaktif", "draft"]),
  target_audience: z.enum(["semua", "calon_siswa", "admin", "panitia"]),
  prioritas: z.number().min(1).max(5),
  tanggal_mulai: z.string(),
  tanggal_berakhir: z.string().optional(),
});

type PengumumanFormData = z.infer<typeof pengumumanSchema>;

// ----------------------------------------------------------------------

export function PengumumanAdminView() {
  const table = useTable();
  const { showSuccess, showError } = useToast();

  const [tableData, setTableData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);

  const openDialog = useBoolean();
  const confirmDialog = useBoolean();

  const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<PengumumanFormData>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: "",
      konten: "",
      tipe: "info",
      status: "aktif",
      target_audience: "semua",
      prioritas: 1,
      tanggal_mulai: new Date().toISOString().slice(0, 16),
      tanggal_berakhir: "",
    },
  });

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPengumuman();
      setTableData(data);
    } catch (error) {
      console.error("Error loading pengumuman:", error);
      showError("Gagal memuat data pengumuman");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle form submission
  const handleSubmit = async (data: PengumumanFormData) => {
    try {
      const submitData: CreatePengumumanData = {
        ...data,
        tanggal_berakhir: data.tanggal_berakhir || null,
      };

      let result;
      if (editingPengumuman) {
        result = await updatePengumuman(
          editingPengumuman.id_pengumuman,
          submitData
        );
      } else {
        result = await createPengumuman(submitData);
      }

      if (result.success) {
        showSuccess(
          editingPengumuman
            ? "Pengumuman berhasil diperbarui!"
            : "Pengumuman berhasil dibuat!"
        );
        handleCloseDialog();
        loadData();
      } else {
        showError(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error submitting pengumuman:", error);
      showError("Terjadi kesalahan saat menyimpan pengumuman");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const result = await deletePengumuman(deletingId);

      if (result.success) {
        showSuccess("Pengumuman berhasil dihapus!");
        loadData();
      } else {
        showError(result.error || "Gagal menghapus pengumuman");
      }
    } catch (error) {
      console.error("Error deleting pengumuman:", error);
      showError("Terjadi kesalahan saat menghapus pengumuman");
    } finally {
      setDeletingId(null);
      confirmDialog.onFalse();
    }
  };

  // Dialog handlers
  const handleOpenDialog = (pengumuman?: Pengumuman) => {
    if (pengumuman) {
      setEditingPengumuman(pengumuman);
      form.reset({
        judul: pengumuman.judul,
        konten: pengumuman.konten,
        tipe: pengumuman.tipe,
        status: pengumuman.status,
        target_audience: pengumuman.target_audience,
        prioritas: pengumuman.prioritas,
        tanggal_mulai: new Date(pengumuman.tanggal_mulai)
          .toISOString()
          .slice(0, 16),
        tanggal_berakhir: pengumuman.tanggal_berakhir
          ? new Date(pengumuman.tanggal_berakhir).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setEditingPengumuman(null);
      form.reset({
        judul: "",
        konten: "",
        tipe: "info",
        status: "aktif",
        target_audience: "semua",
        prioritas: 1,
        tanggal_mulai: new Date().toISOString().slice(0, 16),
        tanggal_berakhir: "",
      });
    }
    openDialog.onTrue();
  };

  const handleCloseDialog = () => {
    openDialog.onFalse();
    setEditingPengumuman(null);
    form.reset();
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeletingId(id);
    confirmDialog.onTrue();
  };

  const dataFiltered = tableData;

  return (
    <DashboardContent
      sx={{
        borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
        pt: 3,
        mb: { xs: 3, md: 5 },
      }}
    >
      <CustomBreadcrumbs
        heading="Kelola pengumuman"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Pengumuman" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Pengumuman
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Container maxWidth="xl">
        <Card>
          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              <Table size="medium" sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PengumumanTableRow
                        key={row.id_pengumuman}
                        row={row}
                        onEditRow={() => handleOpenDialog(row)}
                        onDeleteRow={() =>
                          handleOpenDeleteDialog(row.id_pengumuman)
                        }
                      />
                    ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination
            page={table.page}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        {/* Form Dialog */}
        <Dialog
          open={openDialog.value}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingPengumuman ? "Edit Pengumuman" : "Tambah Pengumuman"}
          </DialogTitle>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <DialogContent>
                <Stack spacing={3}>
                  <TextField
                    {...form.register("judul")}
                    label="Judul Pengumuman"
                    fullWidth
                    error={!!form.formState.errors.judul}
                    helperText={form.formState.errors.judul?.message}
                  />

                  <TextField
                    {...form.register("konten")}
                    label="Konten Pengumuman"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!form.formState.errors.konten}
                    helperText={form.formState.errors.konten?.message}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Tipe</InputLabel>
                      <Select
                        {...form.register("tipe")}
                        label="Tipe"
                        defaultValue="info"
                      >
                        <MenuItem value="info">Info</MenuItem>
                        <MenuItem value="penting">Penting</MenuItem>
                        <MenuItem value="urgent">Urgent</MenuItem>
                        <MenuItem value="sukses">Sukses</MenuItem>
                        <MenuItem value="peringatan">Peringatan</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        {...form.register("status")}
                        label="Status"
                        defaultValue="aktif"
                      >
                        <MenuItem value="aktif">Aktif</MenuItem>
                        <MenuItem value="nonaktif">Non-aktif</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Target Audience</InputLabel>
                      <Select
                        {...form.register("target_audience")}
                        label="Target Audience"
                        defaultValue="semua"
                      >
                        <MenuItem value="semua">Semua</MenuItem>
                        <MenuItem value="calon_siswa">Calon Siswa</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="panitia">Panitia</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      {...form.register("prioritas", { valueAsNumber: true })}
                      label="Prioritas (1-5)"
                      type="number"
                      fullWidth
                      inputProps={{ min: 1, max: 5 }}
                      error={!!form.formState.errors.prioritas}
                      helperText={form.formState.errors.prioritas?.message}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      {...form.register("tanggal_mulai")}
                      label="Tanggal Mulai"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!form.formState.errors.tanggal_mulai}
                      helperText={form.formState.errors.tanggal_mulai?.message}
                    />

                    <TextField
                      {...form.register("tanggal_berakhir")}
                      label="Tanggal Berakhir (Opsional)"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!form.formState.errors.tanggal_berakhir}
                      helperText={
                        form.formState.errors.tanggal_berakhir?.message
                      }
                    />
                  </Stack>
                </Stack>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Batal</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Menyimpan..."
                    : editingPengumuman
                    ? "Update"
                    : "Simpan"}
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDialog.value} onClose={confirmDialog.onFalse}>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogContent>
            <Typography>
              Apakah Anda yakin ingin menghapus pengumuman ini?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDialog.onFalse}>Batal</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Hapus
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardContent>
  );
}
