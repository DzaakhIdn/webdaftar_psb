import { supabase } from "@/utils/supabase/client";

interface PaymentStatus {
  id_biaya: number;
  kode_bayar: string;
  nama_biaya: string;
  jumlah_bayar: number;
  status: string;
}

export async function fetchPaymentUser(
  idSiswa: number
): Promise<PaymentStatus[]> {
  try {
    const { data, error } = await supabase
      .from("pembayaran")
      .select(
        `
    id_biaya,
    kode_bayar,
    jumlah_bayar,
    tanggal_bayar,
    status_verifikasi,
    bukti_bayar_path,
    biaya ( nama_biaya )
  `
      )
      .eq("id_siswa", idSiswa)
      .order("tanggal_bayar", { ascending: false });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log(data);

    // Transform the data to match PaymentStatus interface
    const transformedData: PaymentStatus[] = (data || []).map(
      (payment: any) => ({
        id_biaya: payment.id_biaya,
        kode_bayar: payment.kode_bayar,
        nama_biaya: payment.biaya?.nama_biaya || "",
        jumlah_bayar: payment.jumlah_bayar,
        status: payment.status_verifikasi,
      })
    );

    return transformedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
