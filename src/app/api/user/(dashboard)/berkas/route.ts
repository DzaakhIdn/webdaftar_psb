import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// koneksi supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // jangan lupa ini pakai server-side
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id_siswa, nama_berkas, path_berkas } = body;

  const { error } = await supabase
    .from("berkassiswa")
    .insert([{ id_siswa, nama_berkas, path_berkas }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// ✅ Ambil daftar siswa + berkas
export async function GET() {
  const { data, error } = await supabase.rpc("get_siswa_berkas"); // pakai function SQL (lihat bawah)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
