import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { Form, FormField } from "@/components/ui/form";
import { RHFUpload } from "@/components/hook-form";
import { PaymentWithStatus } from "@/models/fetch-payment-status";

interface DialogFormProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  selectedPayments: number[];
  tableData: PaymentWithStatus[];
  canSelectPayment: (paymentId: number) => boolean;
  getPaymentStatusInfo: (paymentId: number) => PaymentWithStatus | undefined;
  handleSelectAll: () => void;
  handlePaymentToggle: (paymentId: number) => void;
  selectedAmount: number;
  isSubmitting?: boolean;
}

export function DialogForm({
  open,
  onClose,
  form,
  onSubmit,
  selectedPayments,
  tableData,
  canSelectPayment,
  getPaymentStatusInfo,
  handleSelectAll,
  handlePaymentToggle,
  selectedAmount,
  isSubmitting = false,
}: DialogFormProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tambah Pembayaran</DialogTitle>

      <DialogContent sx={{ minWidth: 500 }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Select All Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    selectedPayments.length > 0 &&
                    selectedPayments.length ===
                      tableData.filter((payment) =>
                        canSelectPayment(payment.id_biaya)
                      ).length
                  }
                  indeterminate={
                    selectedPayments.length > 0 &&
                    selectedPayments.length <
                      tableData.filter((payment) =>
                        canSelectPayment(payment.id_biaya)
                      ).length
                  }
                  onChange={handleSelectAll}
                />
              }
              label="Pilih Semua (Yang Tersedia)"
            />

            <Divider />

            {/* Payment Options */}
            <Box sx={{ maxHeight: 300, overflowY: "auto", padding: 1 }}>
              {tableData.map((payment) => {
                const statusInfo = getPaymentStatusInfo(payment.id_biaya);
                const isSelectable = canSelectPayment(payment.id_biaya);
                const isSelected = selectedPayments.includes(payment.id_biaya);

                return (
                  <Box key={payment.id_biaya} sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          disabled={!isSelectable}
                          onChange={() => handlePaymentToggle(payment.id_biaya)}
                        />
                      }
                      label={
                        <Box sx={{ width: "100%" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{
                                color: !isSelectable
                                  ? "text.disabled"
                                  : "text.primary",
                              }}
                            >
                              {payment.nama_biaya}
                            </Typography>
                            {statusInfo &&
                              statusInfo.status !== "available" && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor:
                                      statusInfo.status === "paid"
                                        ? "success.light"
                                        : statusInfo.status === "pending"
                                        ? "warning.light"
                                        : "error.light",
                                    color:
                                      statusInfo.status === "paid"
                                        ? "success.dark"
                                        : statusInfo.status === "pending"
                                        ? "warning.dark"
                                        : "error.dark",
                                  }}
                                >
                                  {statusInfo.status === "paid"
                                    ? "LUNAS"
                                    : statusInfo.status === "pending"
                                    ? "PENDING"
                                    : "DITOLAK"}
                                </Typography>
                              )}
                          </Box>
                          {statusInfo?.status === "pending" && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              Kode: {statusInfo.kode_bayar} | Tanggal:{" "}
                              {new Date(
                                statusInfo.tanggal_bayar || ""
                              ).toLocaleDateString("id-ID")}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Total Amount Display */}
            {selectedPayments.length > 0 && (
              <Box sx={{ bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  Total: Rp {selectedAmount.toLocaleString("id-ID")}
                </Typography>
              </Box>
            )}

            <Divider />

            {/* File Upload */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Upload Bukti Pembayaran
              </Typography>
              <FormField
                control={form.control}
                name="buktiPembayaran"
                render={() => (
                  <RHFUpload
                    name="buktiPembayaran"
                    accept={{ "image/*": [], "application/pdf": [] }}
                    helperText="Upload gambar atau PDF bukti pembayaran"
                  />
                )}
              />
            </Box>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                color="inherit"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={selectedPayments.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Pembayaran"}
              </Button>
            </DialogActions>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
