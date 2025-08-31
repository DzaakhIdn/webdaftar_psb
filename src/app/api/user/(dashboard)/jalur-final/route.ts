import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gender = searchParams.get("gender")?.toLowerCase();

  console.log("API HIT with gender:", gender);

  const { data, error } = await supabase
    .from("jalurfinal")
    .select(
      `
      id_jalur_final,
      nama_jalur_final,
      jenis_kelamin,
      id_jalur,
      jalur (
        nama_jalur,
        kode_jalur
      )
    `
    )
    .eq("jenis_kelamin", gender);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
