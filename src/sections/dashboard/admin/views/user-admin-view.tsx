"use client";

import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Box, MenuItem, Button, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import { DashboardContent } from "@/layout/dashboard";

import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { FormField } from "@/components/ui/form";

import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";

import { ListUserAdminTableRow } from "../user-admin-row";
import { paths } from "@/routes/paths";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import { ListNoHpTableRow } from "../no-hp-row";
import { showAllData } from "@/models";
import {
  sendGenderBasedMessage,
  MESSAGE_TEMPLATES,
} from "@/models/gender-based-messaging";

// =======================================================================

interface User {
  id: string;
  id_user?: string;
  username: string;
  nama_lengkap: string;
  password_hash?: string;
  role: string;
  gender?: string;
  created_at?: string;
}

interface NoHp {
  id: string;
  nama_nomor: string;
  nomor_hp: string;
  gender?: string;
  role?: string;
  created_at?: string;
}

// Interface untuk form
interface UserFormData {
  username: string;
  nama_lengkap: string;
  role: string;
  gender?: string;
  password_hash: string;
}

// Schema untuk validasi form
const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  nama_lengkap: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.string().min(1, "Role harus dipilih"),
  gender: z.string().optional(),
  password_hash: z.string().min(6, "Password minimal 6 karakter"),
});

const TABLE_HEAD = [
  { id: "username", label: "Username", width: 250 },
  { id: "nama_lengkap", label: "Nama Lengkap", width: 200 },
  { id: "role", label: "Role & Password", width: 300 },
  { id: "actions", label: "", width: 100 },
];

const TABLE_HEAD_HP = [
  { id: "nama_penting", label: "Nama Nmor", width: 200 },
  { id: "no_hp", label: "Nomor HP", width: 250 },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function ListUsersView() {
  const table = useTable();

  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<User[]>([]);
  const [noHpData, setNoHpData] = useState<NoHp[]>([]);
  const [loading, setLoading] = useState(false);

  // States for messaging feature
  const [messageDialog, setMessageDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
  const [customMessage, setCustomMessage] = useState<string>(
    MESSAGE_TEMPLATES.custom
  );
  const [sendingMessage, setSendingMessage] = useState(false);
  const [targetRoles, setTargetRoles] = useState<string[]>([
    "panitia",
    "bendahara",
  ]);
  const filtersState = useSetState({
    name: "",
    role: [] as string[],
    status: "all",
  });
  const { state: currentFilters } = filtersState;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all";

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success("Delete success!");

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );
  const openDialog = useBoolean();
  const form = useForm<UserFormData>({
    mode: "onChange",
    resolver: zodResolver(userSchema),
  });

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/admin/users");
        if (response.ok) {
          const users = await response.json();
          // Transform data to match our interface
          const transformedUsers = users.map((user: any) => ({
            id: user.id_user,
            id_user: user.id_user,
            username: user.username,
            nama_lengkap: user.nama_lengkap,
            role: user.role,
            password_hash: user.password_hash,
            created_at: user.created_at,
          }));
          setTableData(transformedUsers);
          toast.success(`Berhasil memuat ${users.length} data users`);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Gagal memuat data users");
        }
      } catch (error) {
        // Handle different types of errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
          toast.error(
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
          );
        } else {
          toast.error("Gagal memuat data users. Silakan refresh halaman.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadNoHp = async () => {
      try {
        // Test direct Supabase connection first
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        console.log("� Testing direct Supabase query...");
        const { data: directData, error: directError } = await supabase
          .from("no_penting")
          .select("*");

        if (directError) {
          // Try with showAllData as fallback
          console.log("� Trying showAllData as fallback...");
          const red = await showAllData("no_penting");

          if (red && Array.isArray(red)) {
            setNoHpData(red as NoHp[]);
            toast.success(`Berhasil memuat ${red.length} data nomor penting`);
            return;
          }

          throw directError;
        }

        if (directData && Array.isArray(directData)) {
          setNoHpData(directData as NoHp[]);

          if (directData.length > 0) {
            toast.success(
              `Berhasil memuat ${directData.length} data nomor penting`
            );
          } else {
            toast.info("Tabel no_penting kosong. Silakan tambahkan data.");
          }
        } else {
          setNoHpData([]);
          toast.error("Format data tidak valid dari tabel no_penting");
        }
      } catch (error: any) {
        // Handle specific Supabase errors
        if (
          error?.message?.includes("relation") &&
          error?.message?.includes("does not exist")
        ) {
          toast.error(
            "Tabel no_penting belum dibuat. Silakan buat tabel terlebih dahulu."
          );
        } else if (
          error?.message?.includes("permission") ||
          error?.code === "42501"
        ) {
          toast.error("Tidak memiliki izin untuk mengakses data nomor penting");
        } else {
          toast.error(
            `Gagal memuat data nomor penting: ${
              error?.message || "Unknown error"
            }`
          );
        }

        // Set fallback data for development

        const fallbackData: NoHp[] = [
          {
            id: "fallback-1",
            nama_nomor: "Admin Sekolah (Fallback)",
            nomor_hp: "08123456789",
            created_at: new Date().toISOString(),
          },
        ];
        setNoHpData(fallbackData);
        toast.info("Menggunakan data fallback untuk development");
      }
    };
    loadNoHp();
  }, []);

  // Handle template selection
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (template !== "custom") {
      setCustomMessage(
        MESSAGE_TEMPLATES[template as keyof typeof MESSAGE_TEMPLATES]
      );
    }
  };

  // Handle target role selection
  const handleTargetRoleChange = (role: string) => {
    setTargetRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  // Handle sending gender-based message
  const handleSendMessage = async () => {
    if (!customMessage.trim()) {
      toast.error("Pesan tidak boleh kosong!");
      return;
    }

    if (targetRoles.length === 0) {
      toast.error("Pilih minimal satu target penerima!");
      return;
    }

    setSendingMessage(true);
    try {
      const result = await sendGenderBasedMessage(customMessage, targetRoles);

      if (result.success) {
        toast.success(result.message);
        setMessageDialog(false);
        setCustomMessage(MESSAGE_TEMPLATES.custom);
        setSelectedTemplate("custom");
        setTargetRoles(["panitia", "bendahara"]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Terjadi kesalahan saat mengirim pesan");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddData = async (data: UserFormData) => {
    try {
      setLoading(true);

      // Validate form data
      if (
        !data.username ||
        !data.nama_lengkap ||
        !data.role ||
        !data.password_hash
      ) {
        toast.error("Semua field harus diisi!");
        return;
      }

      if (data.username.length < 3) {
        toast.error("Username minimal 3 karakter!");
        return;
      }

      if (data.password_hash.length < 6) {
        toast.error("Password minimal 6 karakter!");
        return;
      }

      // Auto-set gender based on role if not explicitly set
      if (!data.gender) {
        if (data.role.includes("_ikhwan")) {
          data.gender = "ikhwan";
        } else if (data.role.includes("_akhwat")) {
          data.gender = "akhwat";
        }
      }

      const response = await fetch("/api/dashboard/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);

        // Add new user to table data
        const newUser = {
          id: result.user.id_user,
          id_user: result.user.id_user,
          username: result.user.username,
          nama_lengkap: result.user.nama_lengkap,
          role: result.user.role,
          password_hash: result.user.password_hash,
          created_at: result.user.created_at,
        };
        setTableData((prev) => [newUser, ...prev]);

        // Reset form and close dialog
        form.reset({
          username: "",
          nama_lengkap: "",
          role: "",
          password_hash: "",
        });
        openDialog.onFalse();
      } else {
        const error = await response.json();

        // Handle specific error messages
        if (response.status === 400) {
          toast.error(error.error || "Data tidak valid");
        } else if (response.status === 500) {
          toast.error("Terjadi kesalahan server. Silakan coba lagi.");
        } else {
          toast.error(error.error || "Gagal menambah user");
        }
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        toast.error("Terjadi kesalahan saat menambah user. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Tambah User</DialogTitle>

      <DialogContent>
        <Form {...form}>
          <form
            id="user-form"
            action="#"
            onSubmit={form.handleSubmit(handleAddData)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            />
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Lengkap"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            />
            <FormField
              control={form.control}
              name="password_hash"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Role"
                  select
                  variant="outlined"
                  margin="dense"
                  fullWidth
                >
                  <MenuItem value="">Pilih Role</MenuItem>
                  <MenuItem value="admin">Admin (Umum)</MenuItem>
                  <MenuItem value="admin_ikhwan">Admin Ikhwan</MenuItem>
                  <MenuItem value="admin_akhwat">Admin Akhwat</MenuItem>
                  <MenuItem value="panitia">Panitia (Umum)</MenuItem>
                  <MenuItem value="panitia_ikhwan">Panitia Ikhwan</MenuItem>
                  <MenuItem value="panitia_akhwat">Panitia Akhwat</MenuItem>
                  <MenuItem value="bendahara">Bendahara (Umum)</MenuItem>
                  <MenuItem value="bendahara_ikhwan">Bendahara Ikhwan</MenuItem>
                  <MenuItem value="bendahara_akhwat">Bendahara Akhwat</MenuItem>
                </TextField>
              )}
            />
          </form>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={openDialog.onFalse} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          form="user-form"
        >
          {loading ? "Menyimpan..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  function renderMessageDialog() {
    return (
      <Dialog
        open={messageDialog}
        onClose={() => setMessageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Kirim Pesan WhatsApp</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Target Penerima:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={targetRoles.includes("panitia")}
                    onChange={() => handleTargetRoleChange("panitia")}
                  />
                }
                label="Panitia"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={targetRoles.includes("bendahara")}
                    onChange={() => handleTargetRoleChange("bendahara")}
                  />
                }
                label="Bendahara"
              />
            </FormGroup>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Template Pesan"
              select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              fullWidth
              margin="dense"
            >
              <MenuItem value="custom">Custom Message</MenuItem>
              <MenuItem value="urgent">Pesan Penting</MenuItem>
              <MenuItem value="meeting">Undangan Rapat</MenuItem>
              <MenuItem value="reminder">Pengingat</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Pesan"
            multiline
            rows={8}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            fullWidth
            margin="dense"
            placeholder="Tulis pesan Anda di sini..."
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setMessageDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Batal
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={sendingMessage || !customMessage.trim()}
            startIcon={
              sendingMessage ? undefined : <Iconify icon="ic:baseline-send" />
            }
          >
            {sendingMessage ? "Mengirim..." : "Kirim Pesan"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List Users dan Nomor Penting"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Admin", href: paths.dashboard.admin.root },
            { name: "List Users dan Nomor Penting" },
          ]}
          action={
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                onClick={() => {
                  setTargetRoles([
                    "panitia",
                    "bendahara",
                    "admin",
                    "bendahara_ikhwan",
                    "bendahara_akhwat",
                    "panitia_ikhwan",
                    "panitia_akhwat",
                    "admin_ikhwan",
                    "admin_akhwat",
                  ]);
                  setMessageDialog(true);
                }}
                variant="outlined"
                startIcon={<Iconify icon="ic:baseline-message" />}
                color="success"
              >
                Kirim ke Semua
              </Button>
              <Button
                onClick={() => {
                  setTargetRoles(["panitia"]);
                  setMessageDialog(true);
                }}
                variant="outlined"
                startIcon={<Iconify icon="ic:baseline-message" />}
                color="info"
              >
                Kirim Info
              </Button>
              <Button
                onClick={openDialog.onTrue}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Users Baru
              </Button>
            </Box>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ width: "100%", overflow: "hidden" }}>
          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row: { id: string }) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row: { id: string }) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: User) => (
                      <ListUserAdminTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.user.edit(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        <Card sx={{ width: "100%", overflow: "hidden", mt: 5 }}>
          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row: { id: string }) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD_HP}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row: { id: string }) => row.id)
                    )
                  }
                />

                <TableBody>
                  {noHpData
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: NoHp) => (
                      <ListNoHpTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.user.edit(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      noHpData.length
                    )}
                  />

                  <TableNoData notFound={noHpData.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={noHpData.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
      {renderFormDialog()}
      {renderMessageDialog()}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: User[];
  comparator: (a: User, b: User) => number;
}): User[] {
  const stabilizedThis: [User, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: User[] = stabilizedThis.map((el) => el[0]);

  return filteredData;
}
