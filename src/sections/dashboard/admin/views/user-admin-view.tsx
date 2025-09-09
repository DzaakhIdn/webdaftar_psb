"use client";

import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Box, MenuItem, Button, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import { DashboardContent } from "@/layout/dashboard";
import { Label } from "@/components/label";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
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
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { paths } from "@/routes/paths";

import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { ChevronsLeftIcon } from "lucide-react";

// =======================================================================

interface User {
  id: string;
  id_user?: string;
  username: string;
  nama_lengkap: string;
  password_hash?: string;
  role: string;
  created_at?: string;
}

// Interface untuk form
interface UserFormData {
  username: string;
  nama_lengkap: string;
  role: string;
  password_hash: string;
}

// Schema untuk validasi form
const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  nama_lengkap: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.string().min(1, "Role harus dipilih"),
  password_hash: z.string().min(6, "Password minimal 6 karakter"),
});

const TABLE_HEAD = [
  { id: "username", label: "Username", width: 250 },
  { id: "nama_lengkap", label: "Nama Lengkap", width: 200 },
  { id: "role", label: "Role & Password", width: 300 },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function ListUsersView() {
  const table = useTable();

  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
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
        console.error("Error loading users:", error);

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
        console.error("API Error:", error);

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
      console.error("Error adding user:", error);

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
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="panitia">Panitia</MenuItem>
                  <MenuItem value="bendahara">Bendahara</MenuItem>
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

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List Users"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Admin", href: paths.dashboard.admin.root },
            { name: "List Users" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Users Baru
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ width: "100%", overflow: "hidden" }}>
          <InvoiceTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ services: [] }}
          />

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
      </DashboardContent>
      {renderFormDialog()}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: User[];
  comparator: (a: User, b: User) => number;
  filters: { name: string; role: string[]; status: string };
}): User[] {
  const { status } = filters;

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
