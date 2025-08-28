"use client";

import { useState, useCallback } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";

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

import { ListProfileSekolahTableRow } from "../profile-sekolah-row";
import { TrackTableToolbar } from "../track-table-toolbar";
import { TrackTableFiltersResult } from "../track-table-filters-result";
import { _profileSekolah } from "@/_mock/_invoice";
import { paths } from "@/routes/paths";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// =======================================================================

interface ProfileSekolah {
  id: string;
  npsn: string;
  namaSekolah: string;
  alamatSekolah: string;
  noTelp: string;
}

const TABLE_HEAD = [
  { id: "npsn", label: "NPSN", width: 250 },
  { id: "namaSekolah", label: "Nama Sekolah", width: 200 },
  { id: "alamatSekolah", label: "Alamat Sekolah", width: 200 },
  { id: "noTelp", label: "No Telp", width: 120 },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function ListProfileSekolahView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ProfileSekolah[]>(_profileSekolah as ProfileSekolah[]);

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

  const renderFormDialog = () => (
    <Dialog open={openDialog.value} onClose={openDialog.onFalse}>
      <DialogTitle>Edit Pembayaran</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error
          corporis reprehenderit nobis tempore distinctio maiores neque quos
          eius rerum dolore.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Kode Pembayaran"
        />
        <TextField
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Nama Pembayaran"
        />
        <TextField
          autoFocus
          fullWidth
          type="number"
          margin="dense"
          variant="outlined"
          label="Jumlah Biaya"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={openDialog.onFalse} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={openDialog.onFalse} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <DashboardContent maxWidth={false}>
        <CustomBreadcrumbs
          heading="List Profile Sekolah"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Master Data", href: paths.dashboard.finance.root },
            { name: "List Profile Sekolah" },
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
                    .map((row: ProfileSekolah) => (
                      <ListProfileSekolahTableRow
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
  inputData: ProfileSekolah[];
  comparator: (a: ProfileSekolah, b: ProfileSekolah) => number;
  filters: { name: string; role: string[]; status: string };
}): ProfileSekolah[] {
  const { status } = filters;

  const stabilizedThis: [ProfileSekolah, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: ProfileSekolah[] = stabilizedThis.map((el) => el[0]);

  return filteredData;
}
