import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/GridLegacy";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Iconify } from "@/components/iconify";

import { useCurrentUser } from "@/hooks/getCurrentUsers";
import {
  fetchPaymentStatusByUser,
  type PaymentWithStatus,
} from "@/models/fetch-payment-status";
import { api } from "@/routes/paths";

export function PaymentRequired() {
  const [paymentData, setPaymentData] = useState<PaymentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: currentUser } = useCurrentUser(api.user.me);

  // Memoized fetch function to avoid recreating on every render
  const fetchPaymentData = useCallback(
    async (showLoading = true) => {
      if (!currentUser?.id) return;

      try {
        if (showLoading) setLoading(true);
        const payments = await fetchPaymentStatusByUser(currentUser.id);
        setPaymentData(payments);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [currentUser?.id]
  );

  // Initial data fetch
  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  // Auto-refresh every 30 seconds to detect new payments
  useEffect(() => {
    if (!currentUser?.id) return;

    const interval = setInterval(() => {
      fetchPaymentData(false); // Don't show loading for auto-refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser?.id, fetchPaymentData]);

  // Listen for storage events (when user adds payment in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "payment_updated") {
        fetchPaymentData(false);
        // Clear the storage item after handling
        localStorage.removeItem("payment_updated");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchPaymentData]);

  // Listen for custom events (when payment is added in same tab)
  useEffect(() => {
    const handlePaymentUpdate = () => {
      fetchPaymentData(false);
    };

    window.addEventListener("paymentUpdated", handlePaymentUpdate);
    return () =>
      window.removeEventListener("paymentUpdated", handlePaymentUpdate);
  }, [fetchPaymentData]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchPaymentData(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPaymentData]);

  // Calculate payment statistics
  const totalPayments = paymentData.length;
  const paidPayments = paymentData.filter((p) => p.status === "paid");
  const pendingPayments = paymentData.filter((p) => p.status === "pending");
  const rejectedPayments = paymentData.filter((p) => p.status === "rejected");
  const unpaidPayments = paymentData.filter((p) => p.status === "available");

  const totalAmount = paymentData.reduce(
    (acc, payment) => acc + payment.jumlah,
    0
  );
  const paidAmount = paidPayments.reduce(
    (acc, payment) => acc + payment.jumlah,
    0
  );
  const pendingAmount = pendingPayments.reduce(
    (acc, payment) => acc + payment.jumlah,
    0
  );
  const unpaidAmount = unpaidPayments.reduce(
    (acc, payment) => acc + payment.jumlah,
    0
  );

  const paymentProgress =
    totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
  const isFullyPaid =
    paidPayments.length === totalPayments && totalPayments > 0;

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Status Pembayaran
        </Typography>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Memuat data pembayaran...
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header Card with Overall Status */}
      <Card sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Iconify icon="solar:card-bold-duotone" width={24} />
            Status Pembayaran
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Refresh data pembayaran">
              <IconButton
                onClick={handleManualRefresh}
                disabled={isRefreshing || loading}
                size="small"
                sx={{
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <Iconify icon="solar:refresh-line-duotone" width={20} />
              </IconButton>
            </Tooltip>
            {isFullyPaid && (
              <Chip
                label="LUNAS"
                color="success"
                variant="filled"
                icon={<Iconify icon="solar:check-circle-bold" width={16} />}
              />
            )}
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress Pembayaran
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(paymentProgress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={paymentProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: isFullyPaid ? "success.main" : "primary.main",
              },
            }}
          />
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{ p: 2, textAlign: "center", bgcolor: "success.lighter" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Iconify
                  icon="solar:check-circle-bold-duotone"
                  width={20}
                  color="success.main"
                />
              </Box>
              <Typography variant="h6" color="success.dark">
                {paidPayments.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lunas
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card
              sx={{ p: 2, textAlign: "center", bgcolor: "warning.lighter" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Iconify
                  icon="solar:clock-circle-bold-duotone"
                  width={20}
                  color="warning.main"
                />
              </Box>
              <Typography variant="h6" color="warning.dark">
                {pendingPayments.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "error.lighter" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Iconify
                  icon="solar:close-circle-bold-duotone"
                  width={20}
                  color="error.main"
                />
              </Box>
              <Typography variant="h6" color="error.dark">
                {rejectedPayments.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ditolak
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "grey.100" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Iconify
                  icon="solar:card-bold-duotone"
                  width={20}
                  color="text.secondary"
                />
              </Box>
              <Typography variant="h6" color="text.primary">
                {unpaidPayments.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Belum Bayar
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Card>

      {/* Financial Summary */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 3, bgcolor: "success.lighter" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon="solar:check-circle-bold-duotone"
                  width={28}
                  color="white"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Sudah Dibayar
                </Typography>
                <Typography variant="h5" color="success.dark" fontWeight={600}>
                  Rp {paidAmount.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              p: 3,
              bgcolor: unpaidAmount > 0 ? "error.lighter" : "grey.100",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: unpaidAmount > 0 ? "error.main" : "grey.400",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify
                  icon={
                    unpaidAmount > 0
                      ? "solar:card-bold-duotone"
                      : "solar:check-circle-bold-duotone"
                  }
                  width={28}
                  color="white"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {unpaidAmount > 0
                    ? "Sisa Belum Dibayar"
                    : "Semua Sudah Lunas"}
                </Typography>
                <Typography
                  variant="h5"
                  color={unpaidAmount > 0 ? "error.dark" : "success.dark"}
                  fontWeight={600}
                >
                  Rp {unpaidAmount.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Status Alert */}
      {isFullyPaid ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selamat! Semua pembayaran telah lunas
          </Typography>
          <Typography variant="body2">
            Anda telah menyelesaikan semua kewajiban pembayaran. Terima kasih
            atas kepercayaan Anda.
          </Typography>
        </Alert>
      ) : unpaidPayments.length > 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Masih ada pembayaran yang belum diselesaikan
          </Typography>
          <Typography variant="body2">
            Anda masih memiliki {unpaidPayments.length} pembayaran yang belum
            dibayar dengan total Rp {unpaidAmount.toLocaleString("id-ID")}.
          </Typography>
        </Alert>
      ) : pendingPayments.length > 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Menunggu verifikasi pembayaran
          </Typography>
          <Typography variant="body2">
            Anda memiliki {pendingPayments.length} pembayaran yang sedang
            menunggu verifikasi dengan total Rp{" "}
            {pendingAmount.toLocaleString("id-ID")}.
          </Typography>
        </Alert>
      ) : null}

      {/* Detail Pembayaran */}
      <Card sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Iconify icon="solar:list-bold-duotone" width={24} />
          Detail Pembayaran
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {paymentData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Iconify
              icon="solar:inbox-bold-duotone"
              width={64}
              color="text.disabled"
            />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Tidak ada data pembayaran
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Belum ada pembayaran yang terdaftar untuk akun Anda
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {paymentData.map((payment, index) => (
              <Box
                key={payment.id_biaya}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    payment.status === "paid"
                      ? "success.lighter"
                      : payment.status === "pending"
                      ? "warning.lighter"
                      : payment.status === "rejected"
                      ? "error.lighter"
                      : "grey.50",
                  border: 1,
                  borderColor:
                    payment.status === "paid"
                      ? "success.main"
                      : payment.status === "pending"
                      ? "warning.main"
                      : payment.status === "rejected"
                      ? "error.main"
                      : "grey.300",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor:
                        payment.status === "paid"
                          ? "success.main"
                          : payment.status === "pending"
                          ? "warning.main"
                          : payment.status === "rejected"
                          ? "error.main"
                          : "grey.400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon={
                        payment.status === "paid"
                          ? "solar:check-circle-bold"
                          : payment.status === "pending"
                          ? "solar:clock-circle-bold"
                          : payment.status === "rejected"
                          ? "solar:close-circle-bold"
                          : "solar:card-bold"
                      }
                      width={20}
                      color="white"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {payment.nama_biaya}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rp {payment.jumlah.toLocaleString("id-ID")}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={
                    payment.status === "paid"
                      ? "LUNAS"
                      : payment.status === "pending"
                      ? "PENDING"
                      : payment.status === "rejected"
                      ? "DITOLAK"
                      : "BELUM BAYAR"
                  }
                  color={
                    payment.status === "paid"
                      ? "success"
                      : payment.status === "pending"
                      ? "warning"
                      : payment.status === "rejected"
                      ? "error"
                      : "default"
                  }
                  variant="filled"
                  size="small"
                />
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
}
