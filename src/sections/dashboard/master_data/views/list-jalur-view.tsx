"use client";

import { useState, useCallback, useEffect } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { z } from "zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
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

import { ListTrackTableRow } from "../list-track-row";
import { TrackTableToolbar } from "../track-table-toolbar";
import { TrackTableFiltersResult } from "../track-table-filters-result";
import { api, paths } from "@/routes/paths";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/providers/toast-provider";
import { fetchData } from "@/models/datas/fetch-data";

// =======================================================================

interface Jalur {
  id_jalur: string;
  kode_jalur: string;
  nama_jalur: string;
  kuota: number;
  status: "aktif" | "nonaktif";
}

const createJalur = z.object({
  kode_jalur: z.string().min(1, "Kode jalur harus diisi"),
  nama_jalur: z.string().min(1, "Nama jalur harus diisi"),
  kuota: z.number().min(1, "Kuota harus lebih dari 0"),
});

const TABLE_HEAD = [
  { id: "kode_jalur", label: "Kode Jalur", width: 250 },
  { id: "nama_jalur", label: "Nama Jalur", width: 200 },
  { id: "kuota", label: "Jumlah Kuota", width: 200 },
  { id: "status", label: "Status", width: 120 },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function ListJalurView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<Jalur[]>([]);
  const { showSuccess, showError } = useToast();

  // Load data on component mount
  fetchData("jalur", tableData, setTableData, showError);

  const filtersState = useSetState({
    name: "",
    role: [] as string[],
    status: "all",
    service: [] as string[],
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

  const form = useForm({
    resolver: zodResolver(createJalur),
    defaultValues: {
      kode_jalur: "",
      nama_jalur: "",
      kuota: 0,
    },
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all" ||
    currentFilters.service.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = async () => {
        try {
          const response = await fetch(api.dashboard.deleteJalur(id), {
            method: "DELETE",
          });

          if (!response.ok) {
            console.error("Response not ok:", response.statusText);
            console.error("Response status:", response.status);
            console.error("Response headers:", response.headers);
            console.error("Response body:", await response.text());
            console.error("Response json:", await response.json());
            console.error("Response url:", response.url);
            throw new Error(response.statusText);
          }

          setTableData((prevData) =>
            prevData.filter((row) => row.id_jalur !== id)
          );
          showSuccess("Data berhasil dihapus!");
          console.log("Data berhasil dihapus!");
        } catch (error) {
          console.error("Delete error:", error);
          showError("Failed to delete data");
        }
      };
      deleteRow();

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, showError]
  );

  const handleUpdateRow = useCallback(
    (id: string, updatedData: Partial<Jalur>) => {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id_jalur === id ? { ...row, ...updatedData } : row
        )
      );
    },
    []
  );

  const handleAddData = async (data: z.infer<typeof createJalur>) => {
    try {
      console.log("Attempting to insert data:", data);
      const response = await fetch(api.dashboard.jalur, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Response not ok:", response.statusText);
        console.error("Response status:", response.status);
        console.error("Response headers:", response.headers);
        console.error("Response body:", await response.text());
        console.error("Response json:", await response.json());
        console.error("Response url:", response.url);
        throw new Error(response.statusText);
      }

      showSuccess("Data berhasil ditambahkan!");
      form.reset();
      openDialog.onFalse(); // Close dialog after successful insert
    } catch (error) {
      console.error("Insert error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };
  const openDialog = useBoolean();

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Tambah Jalur</DialogTitle>

      <DialogContent>
        <Form {...form}>
          <form action="#" onSubmit={form.handleSubmit(handleAddData)}>
            <FormField
              control={form.control}
              name="kode_jalur"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kode Jalur"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="nama_jalur"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Jalur"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="kuota"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Jumlah Kuota"
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
      <DashboardContent
        sx={{
          borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
          pt: 3,
          mb: { xs: 3, md: 5 },
        }}
      >
        <CustomBreadcrumbs
          heading="List Jalur"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Master Data", href: paths.dashboard.finance.root },
            { name: "List Jalur" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Jalur Baru
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ width: "100%", overflow: "hidden" }}>
          <TrackTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ services: [] }}
          />

          {canReset && (
            <TrackTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id_jalur)
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
                      dataFiltered.map((row) => row.id_jalur)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: Jalur) => (
                      <ListTrackTableRow
                        key={row.id_jalur}
                        row={row}
                        selected={table.selected.includes(row.id_jalur)}
                        onSelectRow={() => table.onSelectRow(row.id_jalur)}
                        onDeleteRow={() => handleDeleteRow(row.id_jalur)}
                        onUpdateRow={(updatedData) =>
                          handleUpdateRow(row.id_jalur, updatedData)
                        }
                        editHref={paths.dashboard.user.edit(row.id_jalur)}
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
  inputData: Jalur[];
  comparator: (a: Jalur, b: Jalur) => number;
  filters: { name: string; role: string[]; status: string };
}): Jalur[] {
  const { name, status } = filters;

  const stabilizedThis: [Jalur, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: Jalur[] = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter(
      (jalur) =>
        jalur.kode_jalur.toLowerCase().includes(name.toLowerCase()) ||
        jalur.nama_jalur.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    filteredData = filteredData.filter((jalur) => jalur.status === status);
  }

  return filteredData;
}
