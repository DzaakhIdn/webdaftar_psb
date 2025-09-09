import { supabase } from "@/utils/supabase/client";

// Interface data calon siswa yang bisa diupdate
export interface UpdateCalonSiswa {
  nama_lengkap?: string;
  nik?: string;
  kk?: string;
  nisn?: string;
  npsn_sekolah_asal?: string;
  nis?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  jalur_final_id?: number | null;
  no_hp?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  desa_kelurahan?: string;
  kecamatan?: string;
  kabupaten_kota?: string;
  provinsi?: string;
  kode_pos?: string;
  nama_ayah?: string;
  no_hp_ayah?: string;
  pekerjaan_ayah?: string;
  pendidikan_ayah?: string;
  nama_ibu?: string;
  no_hp_ibu?: string;
  pekerjaan_ibu?: string;
  pendidikan_ibu?: string;
  avatar_url?: string; // Add avatar_url field
}

// Function untuk update data calon siswa
export const updateCalonSiswa = async (
  userId: number,
  userData: UpdateCalonSiswa
) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error("User ID tidak valid");
    }

    // Siapkan field yang akan diupdate
    const updateFields: Record<string, any> = {};
    Object.keys(userData).forEach((key) => {
      const value = userData[key as keyof UpdateCalonSiswa];
      if (value !== undefined && value !== "") {
        updateFields[key] = value;
      }
    });

    if (Object.keys(updateFields).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    // Jika jalur_final_id diset, validasi ada di tabel jalurfinal
    if (updateFields.jalur_final_id) {
      const { data: jalurFinal, error: jalurError } = await supabase
        .from("jalurfinal")
        .select("id_jalur_final, jenis_kelamin")
        .eq("id_jalur_final", updateFields.jalur_final_id)
        .single();

      if (jalurError || !jalurFinal) {
        throw new Error("Jalur final tidak ditemukan");
      }

      // Validasi jenis kelamin cocok
      if (
        updateFields.jenis_kelamin &&
        jalurFinal.jenis_kelamin.toLowerCase() !==
          updateFields.jenis_kelamin.toLowerCase()
      ) {
        throw new Error("Jenis kelamin tidak sesuai dengan jalur yang dipilih");
      }
    }

    // Eksekusi update
    const { data, error } = await supabase
      .from("calonsiswa")
      .update(updateFields)
      .eq("id_siswa", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal mengupdate data: ${error.message}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
};
