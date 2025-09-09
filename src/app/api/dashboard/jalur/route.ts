import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // pakai service_role biar bisa insert
);

// GET all jalur data
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("jalur")
      .select("id_jalur, kode_jalur, nama_jalur, kuota, status")
      .order("nama_jalur", { ascending: true });

    if (error) {
      console.error("Error fetching jalur:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data jalur" },
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kode_jalur, nama_jalur, kuota, status } = body;

    if (!kode_jalur || !nama_jalur) {
      return NextResponse.json(
        { error: "kode_jalur dan nama_jalur wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Insert ke tabel jalur
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .insert([{ kode_jalur, nama_jalur, kuota, status }])
      .select()
      .single();

    if (jalurError) throw jalurError;

    const jalurFinalInsert = [
      {
        kode_final: `${kode_jalur}IKH`,
        nama_jalur_final: `${nama_jalur} IKHWAN`,
        jenis_kelamin: "laki-laki", // sesuai schema db
        id_jalur: jalurData.id_jalur,
      },
      {
        kode_final: `${kode_jalur}AKH`,
        nama_jalur_final: `${nama_jalur} AKHWAT`,
        jenis_kelamin: "perempuan", // sesuai schema db
        id_jalur: jalurData.id_jalur,
      },
    ];

    const { data: jalurFinalData, error: jalurFinalError } = await supabase
      .from("jalurfinal")
      .insert(jalurFinalInsert)
      .select();

    if (jalurFinalError) {
      console.error("Insert ke jalurfinal gagal:", jalurFinalError);
      throw jalurFinalError;
    }

    return NextResponse.json({
      message: "Jalur berhasil ditambahkan",
      jalur: jalurData,
      jalurfinal: jalurFinalData,
    });
  } catch (err: any) {
    console.error("Error inserting jalur:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
