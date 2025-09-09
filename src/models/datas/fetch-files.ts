import { supabase } from "@/utils/supabase/client";

export async function fetchSiswaWithBerkas() {
  try {
    // Ambil data calonsiswa terlebih dahulu
    const { data: siswaData, error: siswaError } = await supabase.from(
      "calonsiswa"
    ).select(`
        id_siswa,
        register_id,
        nama_lengkap,
        no_hp
      `);

    if (siswaError) {
      console.error("Supabase fetch siswa error:", siswaError);
      throw siswaError;
    }

    // Ambil data berkassiswa secara terpisah tanpa nested relation
    const { data: berkasData, error: berkasError } = await supabase.from(
      "berkassiswa"
    ).select(`
        id_siswa,
        id_berkas,
        path_berkas,
        nama_berkas,
        status_verifikasi,
        id_required
      `);

    if (berkasError) {
      console.error("Supabase fetch berkas error:", berkasError);
      throw berkasError;
    }

    // Transform data untuk format yang dibutuhkan component
    const transformedData = siswaData.map((siswa) => {
      // Filter berkas untuk siswa ini
      const siswaBerkas =
        berkasData?.filter(
          (berkas: any) => String(berkas.id_siswa) === String(siswa.id_siswa)
        ) || [];

      const totalRequired = siswaBerkas.length;
      const uploaded = siswaBerkas.filter(
        (b: any) => b.path_berkas && b.status_verifikasi !== "belum"
      ).length;

      let status_upload = "Belum Upload";
      if (uploaded === 0) {
        status_upload = "Belum Upload";
      } else if (uploaded < totalRequired) {
        status_upload = "Sebagian";
      } else if (uploaded === totalRequired) {
        status_upload = "Lengkap";
      }

      // Transform files array to include both nama_berkas and path_berkas
      const files = siswaBerkas
        .map((berkas: any) => ({
          nama_berkas: berkas.nama_berkas || "File",
          path_berkas: berkas.path_berkas,
        }))
        .filter((file: any) => file.path_berkas);

      return {
        id_siswa: siswa.id_siswa,
        register_id: siswa.register_id,
        nama_lengkap: siswa.nama_lengkap,
        no_hp: siswa.no_hp,
        files,
        status_upload,
      };
    });

    return transformedData;
  } catch (err) {
    console.error("Error fetching siswa berkas:", err);
    throw err;
  }
}
