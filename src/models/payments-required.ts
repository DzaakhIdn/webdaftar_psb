import { supabase } from "@/utils/supabase/client";

// Ambil pembayaran yang belum dibayar oleh siswa tertentu
export async function fetchUnpaidPaymentsByUser(userId: number) {
  try {
    // Ambil semua jenis pembayaran
    const { data: jenisPembayaran, error: jenisError } = await supabase
      .from("biaya")
      .select("id_biaya, nama_biaya, jumlah");

    if (jenisError) throw jenisError;

    // Ambil pembayaran sukses milik siswa ini
    const { data: pembayaran, error: pembayaranError } = await supabase
      .from("pembayaran")
      .select("id_biaya")
      .eq("id_siswa", userId)
      .eq("status_verifikasi", "sukses");

    if (pembayaranError) throw pembayaranError;

    // Filter: hanya ambil jenis pembayaran yang belum ada di pembayaran sukses
    const paidIds = new Set(pembayaran.map((p) => p.id_biaya));
    const unpaid = jenisPembayaran.filter((jp) => !paidIds.has(jp.id_biaya));

    return unpaid;
  } catch (error) {
    console.error("Supabase fetch unpaid payments error:", error);
    throw error;
  }
}
