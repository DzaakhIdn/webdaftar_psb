import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("=== DEBUGGING JALUR FINAL DATA ===");
    
    // Test 1: Check all data in jalurFinal table
    const { data: allJalurFinal, error: jalurFinalError } = await supabase
      .from("jalurFinal")
      .select("*");

    console.log("All jalurFinal data:", { allJalurFinal, jalurFinalError });

    // Test 2: Check all data in jalur table
    const { data: allJalur, error: jalurError } = await supabase
      .from("jalur")
      .select("*");

    console.log("All jalur data:", { allJalur, jalurError });

    // Test 3: Check specific gender values in jalurFinal
    const { data: lakiLaki, error: lakiLakiError } = await supabase
      .from("jalurFinal")
      .select("*")
      .eq("jenis_kelamin", "laki-laki");

    const { data: perempuan, error: perempuanError } = await supabase
      .from("jalurFinal")
      .select("*")
      .eq("jenis_kelamin", "perempuan");

    const { data: lakiLakiCaps, error: lakiLakiCapsError } = await supabase
      .from("jalurFinal")
      .select("*")
      .eq("jenis_kelamin", "Laki-laki");

    const { data: perempuanCaps, error: perempuanCapsError } = await supabase
      .from("jalurFinal")
      .select("*")
      .eq("jenis_kelamin", "Perempuan");

    return NextResponse.json({
      jalurFinal: {
        all: allJalurFinal,
        error: jalurFinalError,
        count: allJalurFinal?.length || 0
      },
      jalur: {
        all: allJalur,
        error: jalurError,
        count: allJalur?.length || 0
      },
      genderTests: {
        "laki-laki": { data: lakiLaki, error: lakiLakiError, count: lakiLaki?.length || 0 },
        "perempuan": { data: perempuan, error: perempuanError, count: perempuan?.length || 0 },
        "Laki-laki": { data: lakiLakiCaps, error: lakiLakiCapsError, count: lakiLakiCaps?.length || 0 },
        "Perempuan": { data: perempuanCaps, error: perempuanCapsError, count: perempuanCaps?.length || 0 }
      }
    });

  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
