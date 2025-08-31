import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // First check if we have jalur data
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .select("*");

    if (jalurError || !jalurData || jalurData.length === 0) {
      return NextResponse.json({ 
        error: "No jalur data found", 
        jalurError: jalurError?.message 
      });
    }

    // Create simple jalurFinal entries
    const jalurFinalEntries = [];

    // For each jalur, create entries for both genders
    for (const jalur of jalurData) {
      // For Laki-laki
      jalurFinalEntries.push({
        id_jalur: jalur.id,
        nama_jalur_final: `${jalur.trackName} - Laki-laki`,
        jenis_kelamin: 'laki-laki'
      });

      // For Perempuan  
      jalurFinalEntries.push({
        id_jalur: jalur.id,
        nama_jalur_final: `${jalur.trackName} - Perempuan`,
        jenis_kelamin: 'perempuan'
      });
    }

    // Insert the data
    const { data: insertedData, error: insertError } = await supabase
      .from("jalurFinal")
      .upsert(jalurFinalEntries, { 
        onConflict: 'id_jalur,jenis_kelamin',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      return NextResponse.json({ 
        error: "Insert failed", 
        details: insertError.message,
        entries: jalurFinalEntries
      });
    }

    return NextResponse.json({
      success: true,
      message: "JalurFinal data created successfully",
      jalurData: jalurData,
      insertedData: insertedData,
      count: insertedData?.length || 0
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
