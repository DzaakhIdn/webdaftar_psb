"use client";

import { sumBy } from "es-toolkit";
import { useState, useCallback, useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { fIsAfter, fIsBetween } from "@/utils/format-time";

import { DashboardContent } from "@/layout/dashboard";
import { _invoices, INVOICE_SERVICE_OPTIONS } from "@/_mock";

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

import { InvoiceAnalytic } from "../invoice-analytic";
import { OrderTableRow } from "../order-table-row";
import { InvoiceTableToolbar } from "../invoice-table-toolbar";
import { InvoiceTableFiltersResult } from "../invoice-table-filters-result";
import {
  getPembayaranGroupedByUser,
  getSimplePembayaran,
} from "@/models/datas/fetch-payment-datas";
import { approvePayment, rejectPayment } from "@/models/update-payment-status";
import { useCurrentUser } from "@/hooks/getCurrentUsers";

// ----------------------------------------------------------------------

interface Invoice {
  id_biaya: string;
  kode_bayar: string;
  status_verifikasi: string;
  bukti_bayar_path: string | null;
  tanggal_bayar: string;
  jenis_bayar: string | null;
  jumlah_bayar: number;
  nama_siswa: string | null;
  register_id: string | null;
  no_hp: string | null;
  pembayaran: {
    kode_bayar: string;
    tanggal_bayar: string;
    jenis_bayar: string | null;
    bukti_bayar_path: string | null;
    jumlah_bayar: number;
    status_verifikasi: string;
  }[];
}

const TABLE_HEAD = [
  { id: "kode_bayar", label: "Kode Bayar" },
  { id: "nama_lengkap", label: "Nama Lengkap" },
  { id: "tanggal_bayar", label: "Tanggal Bayar" },
  { id: "total_bayar", label: "Total Bayar" },
  { id: "status", label: "Status", align: "center" },
  { id: "diverifikasi_oleh", label: "Diverifikasi Oleh", align: "center" },
  { id: "actions", label: "" },
];

// ----------------------------------------------------------------------

export function InvoiceListView() {
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: "kode_bayar" });
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current admin user
  const { user: currentAdmin } = useCurrentUser("/api/dashboard/user/me");

  useEffect(() => {
    async function fetchData() {
      console.log("Starting fetchData...");
      setLoading(true);
      try {
        console.log("Calling getPembayaranGroupedByUser...");
        let data = await getPembayaranGroupedByUser();
        console.log("Received data from getPembayaranGroupedByUser:", data);

        // If no data, create dummy data for testing
        if (!data || data.length === 0) {
          console.log("No data found, creating dummy data for testing...");
          data = [
            {
              nama_siswa: "John Doe",
              register_id: "REG001",
              no_hp: "081234567890",
              pembayaran: [
                {
                  kode_bayar: "PAY001",
                  tanggal_bayar: "2024-01-15",
                  jenis_bayar: "Uang Pendaftaran",
                  bukti_bayar_path: null,
                  jumlah_bayar: 500000,
                  status_verifikasi: "sukses",
                },
                {
                  kode_bayar: "PAY002",
                  tanggal_bayar: "2024-01-20",
                  jenis_bayar: "SPP Bulan 1",
                  bukti_bayar_path: null,
                  jumlah_bayar: 300000,
                  status_verifikasi: "pending",
                },
              ],
            },
            {
              nama_siswa: "Jane Smith",
              register_id: "REG002",
              no_hp: "081234567891",
              pembayaran: [
                {
                  kode_bayar: "PAY003",
                  tanggal_bayar: "2024-01-18",
                  jenis_bayar: "Uang Pendaftaran",
                  bukti_bayar_path: null,
                  jumlah_bayar: 500000,
                  status_verifikasi: "ditolak",
                },
              ],
            },
          ];

          console.log("Using dummy data:", data);
        }

        // Transform grouped data to individual invoice records for table display
        const transformedData: Invoice[] = data.map((userGroup, userIndex) => {
          console.log(`Transforming userGroup ${userIndex}:`, userGroup);

          // Calculate total payment amount for this user
          const totalAmount = userGroup.pembayaran.reduce(
            (sum, payment) => sum + payment.jumlah_bayar,
            0
          );

          // Get the latest payment for main row display
          const latestPayment = userGroup.pembayaran[0]; // Already sorted by date desc

          const transformed = {
            id_biaya: `user-${userIndex}`, // Unique ID for each user group
            kode_bayar: latestPayment?.kode_bayar || "",
            status_verifikasi: latestPayment?.status_verifikasi || "",
            bukti_bayar_path: latestPayment?.bukti_bayar_path || null,
            tanggal_bayar: latestPayment?.tanggal_bayar || "",
            jenis_bayar: latestPayment?.jenis_bayar || null,
            jumlah_bayar: totalAmount, // Total amount for this user
            nama_siswa: userGroup.nama_siswa,
            register_id: userGroup.register_id,
            no_hp: userGroup.no_hp,
            pembayaran: userGroup.pembayaran, // Keep all payments for second row
          };

          console.log(`Transformed record ${userIndex}:`, transformed);
          return transformed;
        });

        console.log("Final transformed data:", transformedData);
        setTableData(transformedData);
      } catch (err) {
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
        console.log("fetchData completed");
      }
    }
    fetchData();
  }, []);

  const filters = useSetState({
    name: "",
    service: [],
    status: "all",
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter({
    startDate: currentFilters.startDate,
    endDate: currentFilters.endDate,
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.service.length > 0 ||
    currentFilters.status !== "all" ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: "diterima" | "pending" | "ditolak") =>
    tableData.filter((item) => item.status_verifikasi === status).length;

  const getTotalAmount = (status: "diterima" | "pending" | "ditolak") =>
    sumBy(
      tableData.filter((item) => item.status_verifikasi === status),
      (invoice) => invoice.jumlah_bayar
    );

  const getPercentByStatus = (status: "diterima" | "pending" | "ditolak") =>
    (getInvoiceLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: "all",
      label: "All",
      color: "default" as const,
      count: tableData.length,
    },
    {
      value: "diterima",
      label: "Diterima",
      color: "success" as const,
      count: getInvoiceLength("diterima"),
    },
    {
      value: "pending",
      label: "Pending",
      color: "warning" as const,
      count: getInvoiceLength("pending"),
    },
    {
      value: "ditolak",
      label: "Ditolak",
      color: "error" as const,
      count: getInvoiceLength("ditolak"),
    },
  ];

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id_biaya !== id);

      toast.success("Delete success!");

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleApprovePayment = useCallback(
    async (kode_bayar: string) => {
      try {
        const adminId = currentAdmin?.id;
        if (!adminId) {
          toast.error("Admin tidak teridentifikasi");
          return;
        }
        await approvePayment(kode_bayar, adminId);
        toast.success("Pembayaran berhasil dikonfirmasi!");

        // Refresh data
        const data = await getPembayaranGroupedByUser();
        const transformedData = data.map((userGroup, userIndex) => {
          const totalAmount = userGroup.pembayaran.reduce(
            (sum, payment) => sum + payment.jumlah_bayar,
            0
          );
          const latestPayment = userGroup.pembayaran[0];

          return {
            id_biaya: `user-${userIndex}`,
            kode_bayar: latestPayment?.kode_bayar || "",
            status_verifikasi: latestPayment?.status_verifikasi || "",
            bukti_bayar_path: latestPayment?.bukti_bayar_path || null,
            tanggal_bayar: latestPayment?.tanggal_bayar || "",
            jenis_bayar: latestPayment?.jenis_bayar || null,
            jumlah_bayar: totalAmount,
            nama_siswa: userGroup.nama_siswa,
            register_id: userGroup.register_id,
            no_hp: userGroup.no_hp,
            pembayaran: userGroup.pembayaran,
          };
        });
        setTableData(transformedData);
      } catch (error) {
        console.error("Error approving payment:", error);
        toast.error("Gagal mengkonfirmasi pembayaran");
      }
    },
    [currentAdmin]
  );

  const handleRejectPayment = useCallback(
    async (kode_bayar: string) => {
      try {
        const adminId = currentAdmin?.id;
        if (!adminId) {
          toast.error("Admin tidak teridentifikasi");
          return;
        }
        await rejectPayment(kode_bayar, adminId);
        toast.success("Pembayaran berhasil ditolak!");

        // Refresh data
        const data = await getPembayaranGroupedByUser();
        const transformedData = data.map((userGroup, userIndex) => {
          const totalAmount = userGroup.pembayaran.reduce(
            (sum, payment) => sum + payment.jumlah_bayar,
            0
          );
          const latestPayment = userGroup.pembayaran[0];

          return {
            id_biaya: `user-${userIndex}`,
            kode_bayar: latestPayment?.kode_bayar || "",
            status_verifikasi: latestPayment?.status_verifikasi || "",
            bukti_bayar_path: latestPayment?.bukti_bayar_path || null,
            tanggal_bayar: latestPayment?.tanggal_bayar || "",
            jenis_bayar: latestPayment?.jenis_bayar || null,
            jumlah_bayar: totalAmount,
            nama_siswa: userGroup.nama_siswa,
            register_id: userGroup.register_id,
            no_hp: userGroup.no_hp,
            pembayaran: userGroup.pembayaran,
          };
        });
        setTableData(transformedData);
      } catch (error) {
        console.error("Error rejecting payment:", error);
        toast.error("Gagal menolak pembayaran");
      }
    },
    [currentAdmin]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id_biaya)
    );

    toast.success("Delete success!");

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
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
          heading="List Pembayaran"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Finance", href: paths.dashboard.finance.root },
            { name: "List Pembayaran" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.finance.overview}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Pembayaran Baru
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderStyle: "dashed" }}
                />
              }
              sx={{ py: 2, flexDirection: "row" }}
            >
              <InvoiceAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, (invoice) => invoice.jumlah_bayar)}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <InvoiceAnalytic
                title="Diterima"
                total={getInvoiceLength("diterima")}
                percent={getPercentByStatus("diterima")}
                price={getTotalAmount("diterima")}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <InvoiceAnalytic
                title="Pending"
                total={getInvoiceLength("pending")}
                percent={getPercentByStatus("pending")}
                price={getTotalAmount("pending")}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
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
            {TABS.map((tab) => (
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
                      (tab.value === "pending" && "warning") ||
                      (tab.value === "ditolak" && "error") ||
                      "default"
                    }
                  >
                    {["diterima", "pending", "ditolak"].includes(tab.value)
                      ? tableData.filter(
                          (user) => user.status_verifikasi === tab.value
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              services: INVOICE_SERVICE_OPTIONS.map((option) => option.name),
            }}
          />
          {canReset && (
            <InvoiceTableFiltersResult
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
                  dataFiltered.map((row) => row.id_biaya)
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

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
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
                      dataFiltered.map((row) => row.id_biaya)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id_biaya}
                        row={row}
                        selected={table.selected.includes(row.id_biaya)}
                        onSelectRow={() => table.onSelectRow(row.id_biaya)}
                        onDeleteRow={() => handleDeleteRow(row.id_biaya)}
                        onApprovePayment={handleApprovePayment}
                        onRejectPayment={handleRejectPayment}
                        detailsHref={paths.dashboard.finance.overview}
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
  dateError,
}: {
  inputData: Invoice[];
  comparator: (a: Invoice, b: Invoice) => number;
  filters: {
    name: string;
    status: string;
    service: string[];
    startDate: Date | null;
    endDate: Date | null;
  };
  dateError: boolean;
}): Invoice[] {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map(
    (el, index) => [el, index] as [Invoice, number]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ nama_siswa }) =>
      nama_siswa?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== "all") {
    inputData = inputData.filter(
      (invoice) => invoice.status_verifikasi === status
    );
  }

  if (service.length) {
    inputData = inputData.filter(
      (invoice) => invoice.jenis_bayar && service.includes(invoice.jenis_bayar)
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) =>
        fIsBetween({ inputDate: invoice.tanggal_bayar, startDate, endDate })
      );
    }
  }

  return inputData;
}
