import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function GET() {
  try {
    // Ambil data calonsiswa beserta berkas yang dia upload
    const { data, error } = await supabase.from("calonsiswa").select(`
        id_siswa,
        nama_lengkap,
        no_hp,
        berkassiswa (
          id_berkas,
          path_berkas,
          status_verifikasi,
          requiredfile (
            id_required,
            nama_file,
            deskripsi
          )
        )
      `);

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data siswa" },
        { status: 500 }
      );
    }

    // Tambahin logic status otomatis (Belum Upload / Sebagian / Lengkap)
    const siswaWithStatus = data.map((siswa) => {
      const totalRequired = siswa.berkassiswa?.length || 0;
      const uploaded = siswa.berkassiswa?.filter(
        (b: any) => b.path && b.status !== "belum"
      ).length;

      let status = "Belum Upload";
      if (uploaded === 0) {
        status = "Belum Upload";
      } else if (uploaded < totalRequired) {
        status = "Sebagian";
      } else if (uploaded === totalRequired) {
        status = "Lengkap";
      }

      return {
        ...siswa,
        statusUpload: status,
      };
    });

    return NextResponse.json(siswaWithStatus);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
