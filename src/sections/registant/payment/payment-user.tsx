import { useState, useCallback, useEffect } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { z } from "zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import LinearProgress from "@mui/material/LinearProgress";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import { Label } from "@/components/label";

import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "@/components/table";

import { PaymentRequiredRow } from "./payment-required-row";

import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { fetchPaymentUser } from "@/models/fetch-payment-user";
import {
  fetchPaymentStatusByUser,
  PaymentWithStatus,
} from "@/models/fetch-payment-status";
import { api } from "@/routes/paths";
import { FormControlLabel, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/providers/toast-provider";
import { tambahPembayaran } from "@/models/add-payment";
import { DialogForm } from "./dialog-form";

// ================================= // ============================== //

// Use PaymentWithStatus from the model instead of local interface

interface UserPayment {
  id_biaya: number;
  kode_bayar: string;
  nama_biaya: string;
  jumlah_bayar: number;
  status: string;
}
const TABLE_HEAD = [
  { id: "kode_bayar", label: "Kode Bayar", width: 150 },
  { id: "paymentName", label: "Nama Pembayaran", width: 150 },
  { id: "amount", label: "Jumlah Biaya", width: 150 },
  { id: "status", label: "Status", width: 150 },
];

// Schema untuk form pembayaran
const paymentSchema = z.object({
  selectedPayments: z.array(z.number()).min(1, "Pilih minimal satu pembayaran"),
  buktiPembayaran: z.any().refine((file) => file instanceof File, {
    message: "Bukti pembayaran harus diupload",
  }),
});

export function PaymentUser() {
  const table = useTable();
  const [tableData, setTableData] = useState<PaymentWithStatus[]>([]);
  const [userPaymentData, setUserPaymentData] = useState<UserPayment[]>([]);
  const [paymentStatusData, setPaymentStatusData] = useState<
    PaymentWithStatus[]
  >([]);
  const { user: currentUser } = useCurrentUser(api.user.me);
  const { showSuccess, showError } = useToast();
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      selectedPayments: [],
      buktiPembayaran: null,
    },
  });

  // Fetch payment data and statuses
  useEffect(() => {
    const fetchUserPayments = async () => {
      if (!currentUser?.id) return;

      try {
        const userPayments = await fetchPaymentUser(currentUser.id);
        console.log("Fetched user payments:", userPayments);
        setUserPaymentData(userPayments);
      } catch (error) {
        console.error("Error fetching user payments:", error);
      }
    };

    fetchUserPayments();
  }, [currentUser]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!currentUser?.id) return;

      try {
        // Fetch all payment statuses for validation
        const paymentStatuses = await fetchPaymentStatusByUser(currentUser.id);
        console.log("Fetched payment statuses:", paymentStatuses);
        setPaymentStatusData(paymentStatuses);

        // Also set tableData with the same data for display
        setTableData(paymentStatuses);
        console.log("Table data set:", paymentStatuses);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [currentUser]);

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

  // Use userPaymentData for table display (actual payments made)
  const dataFiltered = applyFilterUserPayments({
    inputData: userPaymentData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });
  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all";

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // Calculate payment statistics
  const totalPaid = userPaymentData
    .filter((payment) => payment.status === "sukses")
    .reduce((acc, row) => acc + row.jumlah_bayar, 0);

  const totalPending = userPaymentData
    .filter((payment) => payment.status === "pending")
    .reduce((acc, row) => acc + row.jumlah_bayar, 0);

  // Calculate remaining payments (available + rejected from paymentStatusData)
  const remainingPayments = paymentStatusData
    .filter(
      (payment) =>
        payment.status === "available" || payment.status === "rejected"
    )
    .reduce((acc, row) => acc + row.jumlah, 0);

  const selectedAmount = selectedPayments.reduce((acc, paymentId) => {
    const payment = tableData.find((p) => p.id_biaya === paymentId);
    return acc + (payment?.jumlah || 0);
  }, 0);

  // Calculate progress percentage
  const totalAllPayments = totalPaid + totalPending + remainingPayments;
  const progressPercentage =
    totalAllPayments > 0 ? (totalPaid / totalAllPayments) * 100 : 0;

  const openDialog = useBoolean();

  // Helper function to check if payment can be selected
  const canSelectPayment = (paymentId: number): boolean => {
    const paymentStatus = paymentStatusData.find(
      (p) => p.id_biaya === paymentId
    );
    return (
      paymentStatus?.status === "available" ||
      paymentStatus?.status === "rejected"
    );
  };

  // Helper function to get payment status info
  const getPaymentStatusInfo = (paymentId: number) => {
    return paymentStatusData.find((p) => p.id_biaya === paymentId);
  };

  // Handler functions
  const handlePaymentToggle = (paymentId: number) => {
    // Check if payment can be selected
    if (!canSelectPayment(paymentId)) {
      const statusInfo = getPaymentStatusInfo(paymentId);
      if (statusInfo?.status === "pending") {
        showError("Pembayaran ini sedang dalam proses verifikasi");
      } else if (statusInfo?.status === "paid") {
        showError("Pembayaran ini sudah lunas");
      }
      return;
    }

    setSelectedPayments((prev) => {
      const newSelected = prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId];

      form.setValue("selectedPayments", newSelected);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    // Only select payments that are available
    const availableIds = tableData
      .filter((payment) => canSelectPayment(payment.id_biaya))
      .map((payment) => payment.id_biaya);

    const newSelected =
      selectedPayments.length === availableIds.length ? [] : availableIds;
    setSelectedPayments(newSelected);
    form.setValue("selectedPayments", newSelected);
  };

  const handleAddData = async (data: z.infer<typeof paymentSchema>) => {
    try {
      setIsSubmitting(true);

      if (!currentUser?.id) {
        showError("User tidak ditemukan");
        return;
      }

      // Calculate total amount for selected payments
      const totalSelectedAmount = data.selectedPayments.reduce(
        (acc, paymentId) => {
          const payment = tableData.find((p) => p.id_biaya === paymentId);
          return acc + (payment?.jumlah || 0);
        },
        0
      );

      await tambahPembayaran(
        currentUser.id,
        currentUser.nama_lengkap,
        data.selectedPayments,
        totalSelectedAmount,
        data.buktiPembayaran
      );

      showSuccess("Pembayaran berhasil ditambahkan!");
      form.reset();
      setSelectedPayments([]);
      openDialog.onFalse();

      // Refresh all payment data after successful payment
      const [userPayments, paymentStatuses] = await Promise.all([
        fetchPaymentUser(currentUser.id),
        fetchPaymentStatusByUser(currentUser.id),
      ]);

      setUserPaymentData(userPayments);
      setPaymentStatusData(paymentStatuses);
      setTableData(paymentStatuses);
    } catch (error) {
      console.error("Payment error:", error);
      showError(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormDialog = () => (
    <DialogForm
      open={openDialog.value}
      onClose={openDialog.onFalse}
      form={form}
      onSubmit={handleAddData}
      selectedPayments={selectedPayments}
      tableData={tableData}
      canSelectPayment={canSelectPayment}
      getPaymentStatusInfo={getPaymentStatusInfo}
      handleSelectAll={handleSelectAll}
      handlePaymentToggle={handlePaymentToggle}
      selectedAmount={selectedAmount}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <Card sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Pembayaran Saya
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button variant="soft" color="success" onClick={openDialog.onTrue}>
            <Iconify icon="solar:info-square-bold" />
          </Button>
          <Button variant="soft" color="primary" onClick={openDialog.onTrue}>
            <Iconify icon="solar:add-circle-line-duotone" width={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Bayar
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table size={table.dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
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
                .map((row: UserPayment) => (
                  <TableRow key={row.id_biaya}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPayments.includes(row.id_biaya)}
                        onClick={() => handlePaymentToggle(row.id_biaya)}
                        slotProps={{
                          input: {
                            id: `${row.id_biaya}-checkbox`,
                            "aria-label": `${row.id_biaya} checkbox`,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.kode_bayar}</TableCell>
                    <TableCell>{row.nama_biaya}</TableCell>
                    <TableCell>
                      Rp {row.jumlah_bayar.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          row.status === "sukses"
                            ? "success"
                            : row.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {row.status === "sukses"
                          ? "LUNAS"
                          : row.status === "pending"
                          ? "PENDING"
                          : "DITOLAK"}
                      </Label>
                    </TableCell>
                  </TableRow>
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
      {/* Payment Statistics */}
      <Box
        sx={{
          p: 3,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Ringkasan Pembayaran
          </Typography>
        </Box>

        {/* Statistics Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Total Paid Card */}
          <Card
            sx={{
              p: 2.5,
              bgcolor: "success.lighter",
              border: "1px solid",
              borderColor: "success.light",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
                borderColor: "success.main",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:check-circle-bold-duotone"
                  width={24}
                  color="white"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Sudah Dibayar
                </Typography>
                <Typography variant="h6" color="success.dark" fontWeight={600}>
                  Rp {totalPaid.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Total Pending Card */}
          <Card
            sx={{
              p: 2.5,
              bgcolor: "warning.lighter",
              border: "1px solid",
              borderColor: "warning.light",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
                borderColor: "warning.main",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "warning.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={24}
                  color="white"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Menunggu Verifikasi
                </Typography>
                <Typography variant="h6" color="warning.dark" fontWeight={600}>
                  Rp {totalPending.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Remaining Payments Card */}
          <Card
            sx={{
              p: 2.5,
              bgcolor: "error.lighter",
              border: "1px solid",
              borderColor: "error.light",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
                borderColor: "error.main",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:card-bold-duotone"
                  width={24}
                  color="white"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Belum Dibayar
                </Typography>
                <Typography variant="h6" color="error.dark" fontWeight={600}>
                  Rp {remainingPayments.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Total Summary */}
        <Card
          sx={{
            p: 3,
            bgcolor: "primary.lighter",
            border: "2px solid",
            borderColor: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 4,
              bgcolor: "primary.light",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:wallet-money-bold-duotone"
                  width={32}
                  color="white"
                />
              </Box>
              <Box>
                <Typography variant="h6" color="primary.dark" fontWeight={600}>
                  Total Keseluruhan Pembayaran
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Semua jenis pembayaran yang tersedia
                </Typography>
              </Box>
            </Box>
            <Typography variant="h4" color="primary.dark" fontWeight={700}>
              Rp{" "}
              {(totalPaid + totalPending + remainingPayments).toLocaleString(
                "id-ID"
              )}
            </Typography>
          </Box>
        </Card>
      </Box>
      {renderFormDialog()}
    </Card>
  );
}

// Filter function for user payment data
function applyFilterUserPayments({
  inputData,
  comparator,
  filters,
}: {
  inputData: UserPayment[];
  comparator: (a: UserPayment, b: UserPayment) => number;
  filters: { name: string; role: string[]; status: string };
}): UserPayment[] {
  const { name } = filters;

  const stabilizedThis: [UserPayment, number][] = inputData.map((el, index) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: UserPayment[] = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter((payment) => {
      return payment.nama_biaya.toLowerCase().includes(name.toLowerCase());
    });
  }

  return filteredData;
}
