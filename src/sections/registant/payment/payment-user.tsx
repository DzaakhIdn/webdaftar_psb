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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

        // Validate data consistency
        const availableCount = paymentStatuses.filter(
          (p) => p.status === "available"
        ).length;
        const paidCount = paymentStatuses.filter(
          (p) => p.status === "paid"
        ).length;
        const pendingCount = paymentStatuses.filter(
          (p) => p.status === "pending"
        ).length;

        console.log("Payment data validation:", {
          total: paymentStatuses.length,
          available: availableCount,
          paid: paidCount,
          pending: pendingCount,
          allCompleted: availableCount === 0,
        });
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [currentUser]);

  // Auto-refresh data every 30 seconds to ensure data consistency
  useEffect(() => {
    if (!currentUser?.id) return;

    const interval = setInterval(async () => {
      try {
        const paymentStatuses = await fetchPaymentStatusByUser(currentUser.id);

        // Use ref to get current state without causing re-renders
        setPaymentStatusData((currentData) => {
          const currentAvailable = currentData.filter(
            (p) => p.status === "available"
          ).length;
          const newAvailable = paymentStatuses.filter(
            (p) => p.status === "available"
          ).length;

          // Only update if there's a change in available payments
          if (currentAvailable !== newAvailable) {
            console.log("Auto-refresh detected changes:", {
              previousAvailable: currentAvailable,
              newAvailable: newAvailable,
            });

            // Also refresh user payment data
            fetchPaymentUser(currentUser.id).then(setUserPaymentData);
            setTableData(paymentStatuses);

            return paymentStatuses;
          }

          return currentData; // No change, return current data
        });
      } catch (error) {
        console.error("Auto-refresh error:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser?.id]); // ← PERBAIKAN: Hapus paymentStatusData dari dependency

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
    .filter((payment) => payment.status === "diterima")
    .reduce((acc, row) => acc + row.jumlah_bayar, 0);

  const totalPending = userPaymentData
    .filter((payment) => payment.status === "pending")
    .reduce((acc, row) => acc + row.jumlah_bayar, 0);

  // Calculate remaining payments (available payments from paymentStatusData)
  const remainingPayments = paymentStatusData
    .filter((payment) => payment.status === "available")
    .reduce((acc, row) => acc + row.jumlah, 0);

  // Additional validation: Check if all payments are completed
  const allPaymentsCompleted =
    paymentStatusData.length > 0 &&
    paymentStatusData.every(
      (payment) => payment.status === "paid" || payment.status === "pending"
    );

  // Log for debugging
  console.log("Payment Status Debug in Component:", {
    totalPaymentTypes: paymentStatusData.length,
    availablePayments: paymentStatusData.filter((p) => p.status === "available")
      .length,
    paidPayments: paymentStatusData.filter((p) => p.status === "paid").length,
    pendingPayments: paymentStatusData.filter((p) => p.status === "pending")
      .length,
    rejectedPayments: paymentStatusData.filter((p) => p.status === "rejected")
      .length,
    remainingPayments,
    allPaymentsCompleted,
    detailedPaymentStatus: paymentStatusData.map((p) => ({
      id: p.id_biaya,
      name: p.nama_biaya,
      status: p.status,
      amount: p.jumlah,
    })),
  });

  const selectedAmount = selectedPayments.reduce((acc, paymentId) => {
    const payment = tableData.find((p) => p.id_biaya === paymentId);
    return acc + (payment?.jumlah || 0);
  }, 0);

  // Calculate progress percentage
  const totalAllPayments = totalPaid + totalPending + remainingPayments;
  const progressPercentage =
    totalAllPayments > 0 ? (totalPaid / totalAllPayments) * 100 : 0;

  const openDialog = useBoolean();

  // Manual refresh function for data validation
  const refreshPaymentData = async () => {
    if (!currentUser?.id) return;

    setIsRefreshing(true);
    try {
      const [userPayments, paymentStatuses] = await Promise.all([
        fetchPaymentUser(currentUser.id),
        fetchPaymentStatusByUser(currentUser.id),
      ]);

      console.log("Manual refresh - Payment data:", {
        userPayments: userPayments.length,
        paymentStatuses: paymentStatuses.length,
        available: paymentStatuses.filter((p) => p.status === "available")
          .length,
        paid: paymentStatuses.filter((p) => p.status === "paid").length,
        pending: paymentStatuses.filter((p) => p.status === "pending").length,
      });

      setUserPaymentData(userPayments);
      setPaymentStatusData(paymentStatuses);
      setTableData(paymentStatuses);

      // Notify other components about payment update
      window.dispatchEvent(new CustomEvent("paymentUpdated"));
      localStorage.setItem("payment_updated", Date.now().toString());

      showSuccess("Data pembayaran berhasil diperbarui!");
    } catch (error) {
      console.error("Error refreshing payment data:", error);
      showError("Gagal memperbarui data pembayaran");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper function to check if payment can be selected
  const canSelectPayment = (paymentId: number): boolean => {
    const paymentStatus = paymentStatusData.find(
      (p) => p.id_biaya === paymentId
    );
    return paymentStatus?.status === "available";
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

      // Prepare payment data with individual amounts
      const paymentData = data.selectedPayments.map((paymentId) => {
        const payment = tableData.find((p) => p.id_biaya === paymentId);
        return {
          id_biaya: paymentId,
          jumlah: payment?.jumlah || 0,
        };
      });

      await tambahPembayaran(
        currentUser.id,
        currentUser.nama_lengkap,
        data.selectedPayments,
        paymentData,
        data.buktiPembayaran
      );

      showSuccess("Pembayaran berhasil ditambahkan!");
      form.reset();
      setSelectedPayments([]);
      openDialog.onFalse();

      // Wait a bit for database to update, then refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh all payment data after successful payment
      const [userPayments, paymentStatuses] = await Promise.all([
        fetchPaymentUser(currentUser.id),
        fetchPaymentStatusByUser(currentUser.id),
      ]);

      console.log("Data after payment refresh:", {
        userPayments: userPayments.length,
        paymentStatuses: paymentStatuses.length,
        availableCount: paymentStatuses.filter((p) => p.status === "available")
          .length,
        paidCount: paymentStatuses.filter((p) => p.status === "paid").length,
        pendingCount: paymentStatuses.filter((p) => p.status === "pending")
          .length,
        rejectedCount: paymentStatuses.filter((p) => p.status === "rejected")
          .length,
        detailedStatuses: paymentStatuses.map((p) => ({
          id: p.id_biaya,
          name: p.nama_biaya,
          status: p.status,
          kode_bayar: p.kode_bayar,
        })),
      });

      setUserPaymentData(userPayments);
      setPaymentStatusData(paymentStatuses);
      setTableData(paymentStatuses);

      // Notify other components about payment update
      window.dispatchEvent(new CustomEvent("paymentUpdated"));
      localStorage.setItem("payment_updated", Date.now().toString());

      // Additional validation: Check if data was properly updated
      const stillAvailable = paymentStatuses.filter(
        (p) => p.status === "available"
      ).length;
      if (stillAvailable === 0) {
        showSuccess("Semua pembayaran telah selesai!");
      } else {
        showSuccess(
          `Pembayaran berhasil! Masih ada ${stillAvailable} pembayaran yang belum dibayar.`
        );
      }
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
        <Box>
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
            Pembayaran Saya
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button
            variant="soft"
            color="info"
            onClick={refreshPaymentData}
            disabled={isRefreshing}
          >
            <Iconify
              icon={
                isRefreshing
                  ? "solar:refresh-bold"
                  : "solar:refresh-line-duotone"
              }
            />
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
                          row.status === "diterima"
                            ? "success"
                            : row.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {row.status === "diterima"
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
