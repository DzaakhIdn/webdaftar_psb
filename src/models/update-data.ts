import { supabase } from "@/utils/supabase/client";

// Fungsi umum untuk update data
export const updateData = async (
  table: string,
  id: number | string | undefined,
  idName: string,
  data: Record<string, any>
) => {
  try {
    // Validasi id
    if (!id) {
      throw new Error(`ID (${idName}) tidak ditemukan`);
    }

    const updateFields: Record<string, any> = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        updateFields[key] = data[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      throw new Error("Tidak ada data yang diupdate");
    }

    // Update ke Supabase
    const { data: updatedData, error } = await supabase
      .from(table)
      .update(updateFields)
      .eq(idName, id)
      .select("*"); // biar balik data terbaru

    if (error) throw error;

    return updatedData;
  } catch (err: any) {
    console.error("Update error:", err.message);
    throw err;
  }
};
