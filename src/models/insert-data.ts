import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function insertData(table: string, datas: any) {
  console.log(`Attempting to insert data to table: ${table}`, datas);

  const { data, error } = await supabase.from(table).insert([datas]).select();

  if (error) {
    console.error(`Error inserting data to ${table}:`, error);
    console.error(`Error details:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  console.log(`Successfully inserted data to ${table}:`, data);
  return data;
}
