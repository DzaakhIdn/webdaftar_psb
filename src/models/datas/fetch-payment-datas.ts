import { supabase } from "@/utils/supabase/client";

export async function getPembayaranGroupedByUser() {
  try {
    console.log("Fetching payment data from Supabase...");

    // First, let's check if there's any data in pembayaran table
    const { data: countData, error: countError } = await supabase
      .from("pembayaran")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error checking pembayaran count:", countError);
    } else {
      console.log("Total records in pembayaran table:", countData);
    }

    // Try a simple query first
    const { data: simpleData, error: simpleError } = await supabase
      .from("pembayaran")
      .select("*")
      .limit(5);

    if (simpleError) {
      console.error("Simple query error:", simpleError);
    } else {
      console.log("Simple query result:", simpleData);
    }

    const { data, error } = await supabase
      .from("pembayaran")
      .select(
        `
        kode_bayar,
        status_verifikasi,
        bukti_bayar_path,
        tanggal_bayar,
        jumlah_bayar,
        biaya (nama_biaya),
        calonsiswa (id_siswa, nama_lengkap, register_id, no_hp)
      `
      )
      .order("tanggal_bayar", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log("Raw data from Supabase:", data);
    console.log("Data length:", data?.length || 0);

    // Group by user
    const grouped: Record<
      string,
      {
        nama_siswa: string | null;
        register_id: string | null;
        no_hp: string | null;
        pembayaran: {
          kode_bayar: string;
          tanggal_bayar: string;
          jenis_bayar: string | null;
          bukti_bayar_path: string | null;
          jumlah_bayar: number;
          status_verifikasi: string;
        }[];
      }
    > = {};

    data.forEach((row, index) => {
      console.log(`Processing row ${index}:`, row);

      const calonsiswa = Array.isArray(row.calonsiswa)
        ? row.calonsiswa[0]
        : row.calonsiswa;
      const userId = calonsiswa?.id_siswa;

      console.log(`Row ${index} - calonsiswa:`, calonsiswa);
      console.log(`Row ${index} - userId:`, userId);

      if (!userId) {
        console.log(`Row ${index} - Skipping: no userId`);
        return;
      }

      if (!grouped[userId]) {
        grouped[userId] = {
          nama_siswa: calonsiswa?.nama_lengkap || null,
          register_id: calonsiswa?.register_id || null,
          no_hp: calonsiswa?.no_hp || null,
          pembayaran: [],
        };
        console.log(`Created new group for userId ${userId}:`, grouped[userId]);
      }

      const biaya = Array.isArray(row.biaya) ? row.biaya[0] : row.biaya;
      const payment = {
        kode_bayar: row.kode_bayar,
        tanggal_bayar: row.tanggal_bayar,
        jenis_bayar: biaya?.nama_biaya || null,
        bukti_bayar_path: row.bukti_bayar_path,
        jumlah_bayar: row.jumlah_bayar,
        status_verifikasi: row.status_verifikasi,
      };

      grouped[userId].pembayaran.push(payment);
      console.log(`Added payment to userId ${userId}:`, payment);
    });

    const result = Object.values(grouped);
    console.log("Final grouped result:", result);
    console.log("Final result length:", result.length);

    return result;
  } catch (err) {
    console.error("Error getPembayaranGroupedByUser:", err);
    throw err;
  }
}

// Alternative simple function for testing
export async function getSimplePembayaran() {
  try {
    console.log("Fetching simple payment data...");

    const { data, error } = await supabase
      .from("pembayaran")
      .select("*")
      .limit(10);

    if (error) {
      console.error("Simple query error:", error);
      throw error;
    }

    console.log("Simple payment data:", data);
    return data || [];
  } catch (err) {
    console.error("Error getSimplePembayaran:", err);
    throw err;
  }
}
