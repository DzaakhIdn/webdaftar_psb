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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            margin: isMobile ? 0 : 2,
            maxHeight: isMobile ? "100vh" : "90vh",
            borderRadius: isMobile ? 0 : 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          px: isMobile ? 2 : 3,
          pt: isMobile ? 2 : 3,
          fontSize: isMobile ? "1.25rem" : "1.5rem",
          fontWeight: 600,
        }}
      >
        Tambah Pembayaran
      </DialogTitle>

      <DialogContent
        sx={{
          minWidth: isMobile ? "auto" : 500,
          px: isMobile ? 2 : 3,
          py: 1,
          overflowY: "auto",
        }}
      >
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
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isMobile ? "0.875rem" : "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  Pilih Semua (Yang Tersedia)
                </Typography>
              }
              sx={{
                alignItems: "flex-start",
                "& .MuiFormControlLabel-label": {
                  mt: isMobile ? 0.5 : 0,
                },
              }}
            />

            <Divider />

            {/* Payment Options */}
            <Box
              sx={{
                maxHeight: isMobile ? 250 : 300,
                overflowY: "auto",
                paddingTop: 2,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "3px",
                },
              }}
            >
              {tableData.map((payment) => {
                const statusInfo = getPaymentStatusInfo(payment.id_biaya);
                const isSelectable = canSelectPayment(payment.id_biaya);
                const isSelected = selectedPayments.includes(payment.id_biaya);

                return (
                  <Box
                    key={payment.id_biaya}
                    sx={{
                      mb: 1,
                      p: isMobile ? 1.5 : 2,
                      border: "1px solid",
                      borderColor: isSelected ? "primary.main" : "grey.200",
                      borderRadius: 1,
                      bgcolor: isSelected ? "primary.50" : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: isSelectable ? "primary.main" : "grey.200",
                        bgcolor: isSelectable ? "primary.25" : "transparent",
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          disabled={!isSelectable}
                          onChange={() => handlePaymentToggle(payment.id_biaya)}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: isMobile ? "1.2rem" : "1.5rem",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ width: "100%", marginLeft: "10px" }}>
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
              <Box
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  p: isMobile ? 1.5 : 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Total: Rp {selectedAmount.toLocaleString("id-ID")}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* File Upload */}
            <Box sx={{ mt: 3 }}>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Upload Bukti Pembayaran
              </Typography>

              <Box
                sx={{
                  "& .MuiBox-root": {
                    minHeight: isMobile ? "140px" : "180px",
                  },
                  "& .upload-placeholder": {
                    padding: isMobile ? "20px" : "32px",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  },
                  "& .MuiTypography-root": {
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    textAlign: "center",
                    mt: 1.5,
                  },
                }}
              >
                <FormField
                  control={form.control}
                  name="buktiPembayaran"
                  render={() => (
                    <RHFUpload
                      name="buktiPembayaran"
                      accept={{ "image/*": [], "application/pdf": [] }}
                      helperText="Upload gambar atau PDF bukti pembayaran (Format: JPG, PNG, PDF • Maksimal 5MB)"
                      maxSize={5242880} // 5MB
                    />
                  )}
                />
              </Box>
            </Box>

            <DialogActions
              sx={{
                px: 0,
                pt: 3,
                gap: 1,
                flexDirection: isMobile ? "column-reverse" : "row",
                "& .MuiButton-root": {
                  minWidth: isMobile ? "100%" : "auto",
                  py: isMobile ? 1.5 : 1,
                },
              }}
            >
              <Button
                onClick={onClose}
                variant={isMobile ? "outlined" : "outlined"}
                color="inherit"
                disabled={isSubmitting}
                size={isMobile ? "large" : "medium"}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={selectedPayments.length === 0 || isSubmitting}
                size={isMobile ? "large" : "medium"}
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
