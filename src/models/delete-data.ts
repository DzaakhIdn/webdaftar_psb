import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function deleteData(table: string, id_name: string, id: string) {
  const { data, error } = await supabase.from(table).delete().eq(id_name, id);

  if (error) {
    console.error(`Error deleting data from ${table}:`, error);
    throw error;
  }

  return data;
}
