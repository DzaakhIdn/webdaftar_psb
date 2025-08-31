import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function showAllData(table: string) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }

  return data;
}
