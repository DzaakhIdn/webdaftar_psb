"use client";

import { useState, useCallback, useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import { paths, api } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { DashboardContent } from "@/layout/dashboard";

import { Label } from "@/components/label";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
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

import { UserTableRow } from "../user-table-row";
import { UserTableToolbar } from "../user-table-toolbar";
import { UserTableFiltersResult } from "../user-table-filters-result";
import { showAllRegistant } from "@/models";
import { Registant } from "@/models/types/registant";
import { supabase } from "@/utils/supabase/client";

// Type for the data returned by showAllRegistant (subset of Registant)
interface RegistantListItem {
  id_siswa: string;
  nama_lengkap: string;
  register_id: string;
  email: string;
  sekolah_asal: string;
  no_hp: string;
  status_pendaftaran:
    | "pending"
    | "verifikasi berkas"
    | "verifikasi pembayaran"
    | "tes wawancara"
    | "sedang tes"
    | "diterima"
    | "ditolak";
  jalur_final_id: string | null;
  password_hash?: string;
  jalurfinal: {
    kode_final: string;
    nama_jalur_final: string;
    jalur: {
      nama_jalur: string;
    }[];
  } | null;
}

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "verifikasi berkas", label: "Verifikasi Berkas" },
  { value: "verifikasi pembayaran", label: "Verifikasi Pembayaran" },
  { value: "tes wawancara", label: "Tes Wawancara" },
  { value: "sedang tes", label: "Sedang Tes" },
  { value: "diterima", label: "Diterima" },
  { value: "ditolak", label: "Ditolak" },
];

const TABLE_HEAD = [
  { id: "name", label: "Name", width: 250 },
  { id: "no_daftar", label: "No Pendaftaran", width: 150 },
  { id: "phoneNumber", label: "No HP", width: 200 },
  { id: "asalSekolah", label: "Asal Sekolah", width: 280 },
  { id: "jalur", label: "Jalur Pendaftaran", width: 200 },
  { id: "status", label: "Status", width: 120 },
  { id: "", label: "", width: 100 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<RegistantListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await showAllRegistant();
      setTableData(data as RegistantListItem[]);
    } catch (error) {
      console.error("Error loading registant data:", error);
      toast.error("Gagal memuat data registrant");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Set up real-time subscription
    const subscription = supabase
      .channel("calonsiswa-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calonsiswa",
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            // Add new record to the list
            loadData(); // For now, just reload all data
          } else if (payload.eventType === "UPDATE") {
            // Update existing record
            loadData(); // For now, just reload all data
          } else if (payload.eventType === "DELETE") {
            // Remove record from list
            const deletedId = payload.old?.id_siswa;
            if (deletedId) {
              setTableData((prev) =>
                prev.filter((row) => row.id_siswa !== deletedId)
              );
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // ← PERBAIKAN: Hapus loadData dan loading dari dependency

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
    async (id: string) => {
      try {
        // Call delete API
        const response = await fetch(api.dashboard.deleteRegistrant(id), {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete registrant");
        }

        toast.success("Registrant berhasil dihapus!");

        // Real-time subscription will handle the removal automatically
        // But we can also remove locally for immediate feedback
        const deleteRow = tableData.filter((row) => row.id_siswa !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus registrant"
        );
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleUpdateRow = useCallback(
    (id: string, updatedData: Partial<RegistantListItem>) => {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id_siswa === id ? { ...row, ...updatedData } : row
        )
      );
    },
    []
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      // Delete multiple registrants
      const deletePromises = table.selected.map(async (id) => {
        const response = await fetch(api.dashboard.deleteRegistrant(id), {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete ${id}: ${errorData.error}`);
        }

        return id;
      });

      await Promise.all(deletePromises);

      toast.success(`${table.selected.length} registrant(s) berhasil dihapus!`);

      // Remove from local state
      const deleteRows = tableData.filter(
        (row) => !table.selected.includes(row.id_siswa)
      );
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);

      // Clear selection
      table.onSelectAllRows(false, []);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus registrant"
      );
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong>{" "}
          items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent maxWidth={false}>
        <CustomBreadcrumbs
          heading="List Pendaftar"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Pendaftar", href: paths.dashboard.user.root },
            { name: "List Pendaftar" },
          ]}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={loadData}
                disabled={loading}
                startIcon={<Iconify icon="solar:refresh-bold" />}
              >
                Refresh
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New user
              </Button>
            </Box>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ width: "100%", overflow: "hidden" }}>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                  theme.vars.palette.grey["500Channel"],
                  0.08
                )}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" ||
                        tab.value === currentFilters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab.value === "diterima" && "success") ||
                      (tab.value === "ditolak" && "error") ||
                      (tab.value === "verifikasi berkas" && "info") ||
                      (tab.value === "verifikasi pembayaran" && "info") ||
                      (tab.value === "tes wawancara" && "primary") ||
                      (tab.value === "sedang tes" && "warning") ||
                      "default"
                    }
                  >
                    {tab.value === "all"
                      ? tableData.length
                      : tableData.filter(
                          (user) => user.status_pendaftaran === tab.value
                        ).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {/* <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          /> */}

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            {loading && (
              <Backdrop
                open={loading}
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <CircularProgress />
              </Backdrop>
            )}

            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row: RegistantListItem) => row.id_siswa)
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
                sx={{ minWidth: 1400 }}
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
                      dataFiltered.map((row: RegistantListItem) => row.id_siswa)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: RegistantListItem) => (
                      <UserTableRow
                        key={row.id_siswa}
                        row={row as any}
                        selected={table.selected.includes(row.id_siswa)}
                        onSelectRow={() => table.onSelectRow(row.id_siswa)}
                        onDeleteRow={() => handleDeleteRow(row.id_siswa)}
                        onUpdateRow={(updatedData) =>
                          handleUpdateRow(row.id_siswa, updatedData)
                        }
                        editHref={paths.dashboard.user.edit(row.id_siswa)}
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

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: RegistantListItem[];
  comparator: (a: RegistantListItem, b: RegistantListItem) => number;
  filters: { name: string; role: string[]; status: string };
}): RegistantListItem[] {
  const { name, status, role } = filters;

  const stabilizedThis: [RegistantListItem, number][] = inputData.map(
    (el, index) => [el, index]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: RegistantListItem[] = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter((user) =>
      user.nama_lengkap.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    filteredData = filteredData.filter(
      (user) => user.status_pendaftaran === status
    );
  }

  // if (role.length) {
  //   filteredData = filteredData.filter((user) => role.includes(user.role));
  // }

  return filteredData;
}
