import { supabase } from "@/utils/supabase/client";

export async function fetchSiswaWithBerkas() {
  const { data, error } = await supabase.rpc("get_siswa_berkas");

  if (error) {
    console.error("Error fetching siswa berkas:", error);
    throw error;
  }

  return data;
}
