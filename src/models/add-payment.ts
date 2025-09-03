import { supabase } from "@/utils/supabase/client";
import { uploadBuktiPembayaran } from "./upload-payment-proof";

export async function tambahPembayaran(
  idSiswa: number,
  selectedPembayaran: number[], // array of id_jenis_pembayaran
  nominal: number,
  buktiPembayaran?: File
) {
  try {
    let buktiUrl = null;

    // Upload bukti pembayaran if provided
    if (buktiPembayaran) {
      const uploadResult = await uploadBuktiPembayaran(
        buktiPembayaran,
        idSiswa,
        selectedPembayaran
      );
      buktiUrl = uploadResult.path_berkas;
    }

    const kode_bayar = `INV-${idSiswa}${Date.now()}`;

    const records = selectedPembayaran.map((idJenis) => ({
      kode_bayar: kode_bayar,
      tanggal_bayar: new Date(),
      id_siswa: idSiswa,
      id_biaya: idJenis,
      jumlah_bayar: nominal,
      bukti_bayar_path: buktiUrl,
    }));

    const { data, error } = await supabase
      .from("pembayaran")
      .insert(records)
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Tambah pembayaran error:", err);
    throw err;
  }
}
