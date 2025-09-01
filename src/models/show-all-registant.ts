import { supabase } from "@/utils/supabase/client";

export async function showAllRegistant() {
  const { data, error } = await supabase.from("calonsiswa").select(`
      id_siswa,
      nama_lengkap,
      register_id,
      email,
      sekolah_asal,
      no_hp,
      status_pendaftaran,
      jalur_final_id
    `);

  if (error) {
    console.error("Error fetching registant:", error);
    throw error;
  }

  // Manually fetch jalurfinal data for each student
  const dataWithJalurFinal = await Promise.all(
    (data || []).map(async (student) => {
      if (student.jalur_final_id) {
        const { data: jalurFinalData } = await supabase
          .from("jalurfinal")
          .select(
            `
            kode_final,
            nama_jalur_final,
            jalur (nama_jalur)
          `
          )
          .eq("id_jalur_final", student.jalur_final_id)
          .single();

        return {
          ...student,
          jalurfinal: jalurFinalData,
        };
      }
      return {
        ...student,
        jalurfinal: null,
      };
    })
  );

  console.log("showAllRegistant processed data:", dataWithJalurFinal);
  return dataWithJalurFinal;
}
