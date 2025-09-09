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

import { TemplateTableRow } from "../template-row";
import { api, paths } from "@/routes/paths";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/providers/toast-provider";
import { showAllData, insertData } from "@/models";
import { FormProvider } from "react-hook-form";

// =======================================================================

interface TemplatePesan {
  id_text: string;
  text_name: string;
  template: string;
}

const createTemplate = z.object({
  text_name: z.string().min(1, "Nama template harus diisi"),
  template: z.string().min(1, "Template pesan harus diisi"),
});

const TABLE_HEAD = [
  { id: "text_name", label: "Text Name", width: 200 },
  { id: "template", label: "Template", width: 400, sx: { maxWidth: 400 } },
  { id: "actions", label: "", width: 100 },
];

// =======================================================================

export function TemplatePesanView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<TemplatePesan[]>([]);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await showAllData("text_template");
        setTableData(data as TemplatePesan[]);
      } catch (error) {
        console.error("Error loading text_template data:", error);
        showError("Failed to load text_template data");
      }
    };

    loadData();
  }, []); // ← PERBAIKAN: Hapus showError dari dependency

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

  const openDialog = useBoolean();
  const form = useForm({
    resolver: zodResolver(createTemplate),
    defaultValues: {
      text_name: "",
      template: "",
    },
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all" ||
    currentFilters.service.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleAddData = async (data: z.infer<typeof createTemplate>) => {
    try {
      console.log("Attempting to insert template data:", data);
      await insertData("text_template", data);

      showSuccess("Template berhasil ditambahkan!");
      form.reset();
      openDialog.onFalse();

      // Refresh data
      const refreshedData = await showAllData("text_template");
      setTableData(refreshedData as TemplatePesan[]);
    } catch (error) {
      console.error("Insert template error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

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
            prevData.filter((row) => row.id_text !== id)
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
    (id: string, updatedData: Partial<TemplatePesan>) => {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id_text === id ? { ...row, ...updatedData } : row
        )
      );
    },
    []
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
          heading="List Template Pesan"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Master Data", href: paths.dashboard.finance.root },
            { name: "List Template Pesan" },
          ]}
        />

        <Card sx={{ width: "100%", overflow: "hidden", marginTop: 3 }}>
          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id_text)
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
                      dataFiltered.map((row) => row.id_text)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: TemplatePesan) => (
                      <TemplateTableRow
                        key={row.id_text}
                        row={row}
                        selected={table.selected.includes(row.id_text)}
                        onSelectRow={() => table.onSelectRow(row.id_text)}
                        onDeleteRow={() => handleDeleteRow(row.id_text)}
                        onUpdateRow={(updatedData) =>
                          handleUpdateRow(row.id_text, updatedData)
                        }
                        editHref={paths.dashboard.user.edit(row.id_text)}
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

  function renderFormDialog() {
    return (
      <Dialog
        open={openDialog.value}
        onClose={openDialog.onFalse}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tambah Template Pesan WhatsApp</DialogTitle>
        <DialogContent>
          <FormProvider {...form}>
            <form
              id="add-template-form"
              onSubmit={form.handleSubmit(handleAddData)}
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
          <Button
            onClick={openDialog.onFalse}
            variant="outlined"
            color="inherit"
          >
            Batal
          </Button>
          <Button type="submit" variant="contained" form="add-template-form">
            Simpan Template
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: TemplatePesan[];
  comparator: (a: TemplatePesan, b: TemplatePesan) => number;
  filters: { name: string; role: string[]; status: string };
}): TemplatePesan[] {
  const { name } = filters;

  const stabilizedThis: [TemplatePesan, number][] = inputData.map(
    (el, index) => [el, index]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: TemplatePesan[] = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter(
      (jalur) =>
        jalur.text_name.toLowerCase().includes(name.toLowerCase()) ||
        jalur.template.toLowerCase().includes(name.toLowerCase())
    );
  }

  return filteredData;
}
