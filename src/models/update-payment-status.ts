import { supabase } from "@/utils/supabase/client";

/**
 * Update payment status (approve or reject)
 */
export async function updatePaymentStatus(
  kode_bayar: string,
  status: "diterima" | "ditolak",
  diverifikasi_oleh?: string
) {
  try {
    const updateData: any = {
      status_verifikasi: status,
      tanggal_verifikasi: new Date().toISOString(),
    };

    // Add diverifikasi_oleh if provided (convert to integer if it's a valid number)
    if (diverifikasi_oleh) {
      // Try to convert to integer, if it fails, use as string
      const adminId = parseInt(diverifikasi_oleh);
      updateData.diverifikasi_oleh = isNaN(adminId)
        ? diverifikasi_oleh
        : adminId;
    }

    const { data, error } = await supabase
      .from("pembayaran")
      .update(updateData)
      .eq("kode_bayar", kode_bayar)
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error updating payment status:", err);
    throw err;
  }
}

/**
 * Approve payment
 */
export async function approvePayment(
  kode_bayar: string,
  diverifikasi_oleh?: string
) {
  return updatePaymentStatus(kode_bayar, "diterima", diverifikasi_oleh);
}

/**
 * Reject payment
 */
export async function rejectPayment(
  kode_bayar: string,
  diverifikasi_oleh?: string
) {
  return updatePaymentStatus(kode_bayar, "ditolak", diverifikasi_oleh);
}
