import { supabase } from "@/utils/supabase/client";

export async function fetchSiswaWithBerkas() {
  try {
    // Ambil data calonsiswa beserta berkas yang dia upload
    const { data, error } = await supabase.from("calonsiswa").select(`
        id_siswa,
        register_id,
        nama_lengkap,
        no_hp,
        berkassiswa (
          id_berkas,
          path_berkas,
          nama_berkas,
          status_verifikasi,
          requiredfile (
            id_required,
            nama_berkas,
            deskripsi
          )
        )
      `);

    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }

    // Transform data untuk format yang dibutuhkan component
    const transformedData = data.map((siswa) => {
      const totalRequired = siswa.berkassiswa?.length || 0;
      const uploaded = siswa.berkassiswa?.filter(
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
      const files =
        siswa.berkassiswa
          ?.map((berkas: any) => ({
            nama_berkas:
              berkas.nama_berkas || berkas.requiredfile?.nama_berkas || "File",
            path_berkas: berkas.path_berkas,
          }))
          .filter((file: any) => file.path_berkas) || [];

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
