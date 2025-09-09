import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all jalur final data
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("jalurfinal")
      .select(`
        id_jalur_final,
        nama_jalur_final,
        jenis_kelamin,
        jalur (
          nama_jalur,
          kode_jalur
        )
      `)
      .order("nama_jalur_final", { ascending: true });

    if (error) {
      console.error("Error fetching jalur final:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data jalur final" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
