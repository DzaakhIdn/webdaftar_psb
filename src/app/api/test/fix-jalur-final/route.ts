import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("=== FIXING JALUR FINAL DATA ===");
    
    // First, get all jalur data
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .select("id_jalur, kode_jalur, nama_jalur, kuota, status")
      .eq("status", "aktif");

    if (jalurError) {
      throw new Error(`Error fetching jalur: ${jalurError.message}`);
    }

    console.log("Jalur data:", jalurData);

    // Clear existing jalurFinal data first
    const { error: deleteError } = await supabase
      .from("jalurFinal")
      .delete()
      .neq("id_jalur_final", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (deleteError) {
      console.warn("Warning deleting existing data:", deleteError);
    }

    // Create jalurFinal entries based on jalur data and gender logic
    const jalurFinalEntries = [];

    for (const jalur of jalurData || []) {
      const kodeJalur = jalur.kode_jalur.toLowerCase();
      const namaJalur = jalur.nama_jalur.toLowerCase();
      
      if (namaJalur.includes('akhwat') || kodeJalur.includes('akh')) {
        // For Akhwat (Perempuan)
        jalurFinalEntries.push({
          id_jalur: jalur.id_jalur,
          nama_jalur_final: jalur.nama_jalur,
          jenis_kelamin: 'perempuan'
        });
      } else if (namaJalur.includes('ikhwan') || kodeJalur.includes('ikh')) {
        // For Ikhwan (Laki-laki)
        jalurFinalEntries.push({
          id_jalur: jalur.id_jalur,
          nama_jalur_final: jalur.nama_jalur,
          jenis_kelamin: 'laki-laki'
        });
      }
    }

    console.log("JalurFinal entries to insert:", jalurFinalEntries);

    if (jalurFinalEntries.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No jalur final entries to create",
        jalurData: jalurData
      });
    }

    // Insert jalurFinal data
    const { data: insertedData, error: insertError } = await supabase
      .from("jalurFinal")
      .insert(jalurFinalEntries)
      .select();

    if (insertError) {
      throw new Error(`Error inserting jalurFinal: ${insertError.message}`);
    }

    console.log("Inserted jalurFinal data:", insertedData);

    // Verify the data
    const { data: verifyData, error: verifyError } = await supabase
      .from("jalurFinal")
      .select(`
        id_jalur_final,
        nama_jalur_final,
        jenis_kelamin,
        id_jalur
      `);

    return NextResponse.json({
      success: true,
      message: "JalurFinal data fixed successfully",
      jalurData: jalurData,
      inserted: insertedData,
      verification: verifyData,
      count: insertedData?.length || 0
    });

  } catch (error) {
    console.error("Fix jalur final error:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
