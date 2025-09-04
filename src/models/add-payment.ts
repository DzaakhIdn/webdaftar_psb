import { supabase } from "@/utils/supabase/client";
import { uploadBuktiPembayaran } from "./upload-payment-proof";

export async function tambahPembayaran(
  idSiswa: number,
  namaSiswa: string,
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
        namaSiswa,
        selectedPembayaran
      );
      buktiUrl = uploadResult.path_berkas;
    }

    const lastuser = await supabase
      .from("pembayaran")
      .select("kode_bayar")
      .order("kode_bayar", { ascending: false })
      .limit(1)
      .single();

    let newId = "INV-001";
    if (lastuser.data) {
      const last_num = parseInt(lastuser.data.kode_bayar.replace("INV-", ""));
      newId = `INV-${(last_num + 1).toString().padStart(3, "0")}`;
    }

    const records = selectedPembayaran.map((idJenis) => ({
      kode_bayar: newId,
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
