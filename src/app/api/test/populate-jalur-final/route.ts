import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("=== POPULATING JALUR FINAL DATA ===");

    // First, get all jalur data
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .select("*");

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

    // Create jalurFinal entries based on jalur data
    const jalurFinalEntries = [];

    for (const jalur of jalurData || []) {
      const trackCode = jalur.trackCode.toLowerCase();

      if (trackCode.includes("akhwat") || trackCode.includes("akh")) {
        // For Akhwat (Perempuan)
        jalurFinalEntries.push({
          id_jalur: jalur.id,
          nama_jalur_final: jalur.trackName,
          jenis_kelamin: "perempuan",
        });
      } else if (trackCode.includes("ikhwan") || trackCode.includes("ikh")) {
        // For Ikhwan (Laki-laki)
        jalurFinalEntries.push({
          id_jalur: jalur.id,
          nama_jalur_final: jalur.trackName,
          jenis_kelamin: "laki-laki",
        });
      } else {
        // For general jalur, create both gender options
        jalurFinalEntries.push({
          id_jalur: jalur.id,
          nama_jalur_final: `${jalur.trackName} (Laki-laki)`,
          jenis_kelamin: "laki-laki",
        });
        jalurFinalEntries.push({
          id_jalur: jalur.id,
          nama_jalur_final: `${jalur.trackName} (Perempuan)`,
          jenis_kelamin: "perempuan",
        });
      }
    }

    console.log("JalurFinal entries to insert:", jalurFinalEntries);

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
    const { data: verifyData, error: verifyError } = await supabase.from(
      "jalurFinal"
    ).select(`
        id_jalur_final,
        nama_jalur_final,
        jenis_kelamin,
        id_jalur
      `);

    return NextResponse.json({
      success: true,
      message: "JalurFinal data populated successfully",
      inserted: insertedData,
      verification: verifyData,
      count: insertedData?.length || 0,
    });
  } catch (error) {
    console.error("Populate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
