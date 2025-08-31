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

import { ListJenjangTableRow } from "../jenjang-row";
import { TrackTableToolbar } from "../track-table-toolbar";
import { TrackTableFiltersResult } from "../track-table-filters-result";
import { _jenjang } from "@/_mock/_invoice";
import { paths } from "@/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { insertData, showAllData } from "@/models";
import { useToast } from "@/components/providers/toast-provider";

// =======================================================================

interface Jenjang {
  id_jenjang: string;
  jenjangCode: string;
  jenjangName: string;
  quota: number;
  status: "aktif" | "nonaktif";
}

const createJenjang = z.object({
  kode_jenjang: z.string().min(1, "Kode jenjang harus diisi"),
  nama_jenjang: z.string().min(1, "Nama jenjang harus diisi"),
  kuota: z.number().min(1, "Kuota harus lebih dari 0"),
});

const TABLE_HEAD = [
  { id: "jenjangCode", label: "Kode Jenjang", width: 250 },
  { id: "jenjangName", label: "Nama Jenjang", width: 200 },
  { id: "quota", label: "Jumlah Kuota", width: 200 },
  { id: "status", label: "Status", width: 120 },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function ListJenjangView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<Jenjang[]>([]);
  const { showSuccess, showError } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await showAllData("jenjang");
        setTableData(data as Jenjang[]);
      } catch (error) {
        console.error("Error loading jenjang data:", error);
        showError("Failed to load jenjang data");
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
      const deleteRow = tableData.filter((row) => row.id_jenjang !== id);

      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );
  const openDialog = useBoolean();
  const form = useForm({
    resolver: zodResolver(createJenjang),
    defaultValues: {
      kode_jenjang: "",
      nama_jenjang: "",
      kuota: 0,
    },
  });

  const handleAddData = async (data: z.infer<typeof createJenjang>) => {
    try {
      console.log("Attempting to insert data:", data);
      await insertData("jenjang", data);

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
  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Tambah Jenjang</DialogTitle>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddData)}>
            <FormField
              control={form.control}
              name="kode_jenjang"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Kode Jenjang"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                />
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="nama_jenjang"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Jenjang"
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
              <Button type="submit" variant="contained">
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
          heading="List Jenjang"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Master Data", href: paths.dashboard.finance.root },
            { name: "List Jenjang" },
          ]}
          action={
            <Button
              onClick={openDialog.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Jenjang Baru
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
                    .map((row: Jenjang) => (
                      <ListJenjangTableRow
                        key={row.id_jenjang}
                        row={row}
                        selected={table.selected.includes(row.id_jenjang)}
                        onSelectRow={() => table.onSelectRow(row.id_jenjang)}
                        onDeleteRow={() => handleDeleteRow(row.id_jenjang)}
                        onUpdateRow={(updatedData) => {
                          // Update the row in the table data
                          setTableData((prev) =>
                            prev.map((item) =>
                              item.id_jenjang === row.id_jenjang
                                ? { ...item, ...updatedData }
                                : item
                            )
                          );
                        }}
                        editHref={paths.dashboard.user.edit(row.id_jenjang)}
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
  inputData: Jenjang[];
  comparator: (a: Jenjang, b: Jenjang) => number;
  filters: { name: string; role: string[]; status: string };
}): Jenjang[] {
  const { status } = filters;

  const stabilizedThis: [Jenjang, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: Jenjang[] = stabilizedThis.map((el) => el[0]);

  if (status !== "all") {
    filteredData = filteredData.filter((user) => user.status === status);
  }

  return filteredData;
}
