import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jalurId = searchParams.get("jalur_id");
    const jenisKelamin = searchParams.get("jenis_kelamin")?.toLowerCase();

    if (!jalurId || !jenisKelamin) {
      return NextResponse.json(
        { error: "jalur_id dan jenis_kelamin harus diisi" },
        { status: 400 }
      );
    }

    if (!["laki-laki", "perempuan"].includes(jenisKelamin)) {
      return NextResponse.json(
        { error: "jenis_kelamin harus 'laki-laki' atau 'perempuan'" },
        { status: 400 }
      );
    }

    console.log("=== API JALUR FINAL DEBUG ===");
    console.log("jalurId:", jalurId);
    console.log("jenisKelamin:", jenisKelamin);

    // Get jalur final options based on jalur and gender (without relation)
    const { data: jalurFinalData, error: jalurFinalError } = await supabase
      .from("jalurFinal")
      .select("id_jalur_final, nama_jalur_final, id_jalur, jenis_kelamin")
      .eq("id_jalur", jalurId)
      .eq("jenis_kelamin", jenisKelamin);

    console.log("JalurFinal query result:", {
      jalurFinalData,
      jalurFinalError,
    });

    if (jalurFinalError) {
      console.error("Error fetching jalur final:", jalurFinalError);
      return NextResponse.json(
        { error: jalurFinalError.message },
        { status: 500 }
      );
    }

    // Get jalur data separately
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .select("id_jalur, nama_jalur, kode_jalur")
      .eq("id_jalur", jalurId)
      .single();

    console.log("Jalur query result:", { jalurData, jalurError });

    if (jalurError) {
      console.error("Error fetching jalur:", jalurError);
      return NextResponse.json({ error: jalurError.message }, { status: 500 });
    }

    // Combine the data manually
    const combinedData =
      jalurFinalData?.map((jf) => ({
        id_jalur_final: jf.id_jalur_final,
        nama_jalur_final: jf.nama_jalur_final,
        jenis_kelamin: jf.jenis_kelamin,
        jalur: jalurData,
      })) || [];

    console.log("Combined data:", combinedData);

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("API jalur-final-options error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
