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
import { DashboardContent } from "@/layout/dashboard";
import { Label } from "@/components/label";
import { useToast } from "@/components/providers/toast-provider";
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

import { UserFilesRow } from "../user-files-row";
import { UserTableToolbar } from "../user-table-toolbar";
import { UserTableFiltersResult } from "../user-table-filters-result";
import { paths } from "@/routes/paths";
import { fetchSiswaWithBerkas } from "@/models/datas/fetch-files";

interface User {
  id_siswa: string;
  register_id: string;
  nama_lengkap: string;
  no_hp: string;
  files: { nama_berkas: string; path_berkas: string }[];
  status_upload: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "none", label: "Belum Upload" },
  { value: "some", label: "Sebagian" },
  { value: "complete", label: "Lengkap" },
];

const TABLE_HEAD = [
  { id: "name", label: "Name", width: 250 },
  { id: "phoneNumber", label: "No HP", width: 200 },
  { id: "status", label: "Status", width: 120 },
  { id: "files", label: "Files", width: 100 },
];

// =======================================================================

export function UserFilesView() {
  const table = useTable();

  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<User[]>([]);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSiswaWithBerkas();

        // console.log("Raw data from fetchSiswaWithBerkas:", data);

        // Check if data exists and is an array
        if (!data || !Array.isArray(data)) {
          console.log("No data or data is not an array");
          setTableData([]);
          return;
        }

        // Just set the data directly for now to see what we get
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Failed to fetch data");
        setTableData([]);
      }
    };

    fetchData();
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
      const deleteRow = tableData.filter((row) => row.id_siswa !== id);

      showSuccess("Delete success!");

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, showSuccess]
  );

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List File Pendaftar" // List File Pendaftar
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Pendaftar", href: paths.dashboard.user.root },
            { name: "List File Pendaftar" },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.user.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New user
          //   </Button>
          // }
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
                      (tab.value === "complete" && "success") ||
                      (tab.value === "some" && "warning") ||
                      (tab.value === "none" && "error") ||
                      "default"
                    }
                  >
                    {tab.value === "all"
                      ? tableData.length
                      : tableData.filter((user) => {
                          if (tab.value === "none")
                            return user.status_upload === "Belum Upload";
                          if (tab.value === "some")
                            return user.status_upload === "Sebagian";
                          if (tab.value === "complete")
                            return user.status_upload === "Lengkap";
                          return user.status_upload === tab.value;
                        }).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: [] }}
          />

          {canReset && (
            <UserTableFiltersResult
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
                  dataFiltered.map((row: User) => row.id_siswa)
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
                sx={{ minWidth: 1000 }}
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
                      dataFiltered.map((row: User) => row.id_siswa)
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
                      <UserFilesRow
                        key={row.id_siswa}
                        row={row}
                        selected={table.selected.includes(row.id_siswa)}
                        onSelectRow={() => table.onSelectRow(row.id_siswa)}
                        onDeleteRow={() => handleDeleteRow(row.id_siswa)}
                        editHref={paths.dashboard.user.edit(
                          String(row.id_siswa)
                        )}
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
  const { name, status } = filters;

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

  if (name) {
    filteredData = filteredData.filter((user) =>
      user.nama_lengkap.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    filteredData = filteredData.filter((user) => {
      if (status === "none") return user.status_upload === "Belum Upload";
      if (status === "some") return user.status_upload === "Sebagian";
      if (status === "complete") return user.status_upload === "Lengkap";
      return user.status_upload === status;
    });
  }

  return filteredData;
}
