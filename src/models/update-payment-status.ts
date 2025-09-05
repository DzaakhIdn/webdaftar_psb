import { supabase } from "@/utils/supabase/client";

/**
 * Update payment status (approve or reject)
 */
export async function updatePaymentStatus(
  kode_bayar: string,
  status: "diterima" | "ditolak"
) {
  try {
    const { data, error } = await supabase
      .from("pembayaran")
      .update({ 
        status_verifikasi: status,
        tanggal_verifikasi: new Date().toISOString()
      })
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
export async function approvePayment(kode_bayar: string) {
  return updatePaymentStatus(kode_bayar, "diterima");
}

/**
 * Reject payment
 */
export async function rejectPayment(kode_bayar: string) {
  return updatePaymentStatus(kode_bayar, "ditolak");
}
