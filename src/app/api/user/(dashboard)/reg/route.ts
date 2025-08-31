import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Insert siswa
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("calon_siswa")
    .insert([body])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// List siswa + join jalur
export async function GET() {
  const { data, error } = await supabase.from("calon_siswa").select(`
      id_siswa,
      nama_lengkap,
      no_hp,
      status_pendaftaran,
      jalurfinal (
        kode_final,
        nama_jalur_final,
        jalur (nama_jalur)
      )
    `);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
