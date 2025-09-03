import { supabase } from "@/utils/supabase/client";

export interface PaymentWithStatus {
  id_biaya: number;
  nama_biaya: string;
  jumlah: number;
  status: 'available' | 'pending' | 'paid' | 'rejected';
  kode_bayar?: string;
  tanggal_bayar?: string;
  bukti_bayar_path?: string;
}

export async function fetchPaymentStatusByUser(userId: number): Promise<PaymentWithStatus[]> {
  try {
    // Ambil semua jenis pembayaran
    const { data: jenisPembayaran, error: jenisError } = await supabase
      .from("biaya")
      .select("id_biaya, nama_biaya, jumlah");

    if (jenisError) throw jenisError;

    // Ambil semua pembayaran milik siswa ini (semua status)
    const { data: pembayaran, error: pembayaranError } = await supabase
      .from("pembayaran")
      .select("id_biaya, status_verifikasi, kode_bayar, tanggal_bayar, bukti_bayar_path")
      .eq("id_siswa", userId);

    if (pembayaranError) throw pembayaranError;

    // Create a map of payment statuses
    const paymentStatusMap = new Map();
    pembayaran.forEach((p) => {
      paymentStatusMap.set(p.id_biaya, {
        status_verifikasi: p.status_verifikasi,
        kode_bayar: p.kode_bayar,
        tanggal_bayar: p.tanggal_bayar,
        bukti_bayar_path: p.bukti_bayar_path,
      });
    });

    // Map all payment types with their status
    const paymentsWithStatus: PaymentWithStatus[] = jenisPembayaran.map((jp) => {
      const paymentInfo = paymentStatusMap.get(jp.id_biaya);
      
      let status: PaymentWithStatus['status'] = 'available';
      
      if (paymentInfo) {
        switch (paymentInfo.status_verifikasi) {
          case 'sukses':
            status = 'paid';
            break;
          case 'pending':
            status = 'pending';
            break;
          case 'ditolak':
            status = 'rejected';
            break;
          default:
            status = 'available';
        }
      }

      return {
        id_biaya: jp.id_biaya,
        nama_biaya: jp.nama_biaya,
        jumlah: jp.jumlah,
        status,
        kode_bayar: paymentInfo?.kode_bayar,
        tanggal_bayar: paymentInfo?.tanggal_bayar,
        bukti_bayar_path: paymentInfo?.bukti_bayar_path,
      };
    });

    return paymentsWithStatus;
  } catch (error) {
    console.error("Supabase fetch payment status error:", error);
    throw error;
  }
}
