import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log("=== TESTING JALUR FINAL TABLE ===");
    
    // Test 1: Check if jalurFinal table exists and has data
    const { data: jalurFinalData, error: jalurFinalError } = await supabase
      .from("jalurFinal")
      .select("*")
      .limit(10);

    console.log("JalurFinal table test:", { jalurFinalData, jalurFinalError });

    // Test 2: Check jalur table
    const { data: jalurData, error: jalurError } = await supabase
      .from("jalur")
      .select("*")
      .limit(10);

    console.log("Jalur table test:", { jalurData, jalurError });

    return NextResponse.json({
      jalurFinal: {
        data: jalurFinalData,
        error: jalurFinalError,
        count: jalurFinalData?.length || 0
      },
      jalur: {
        data: jalurData,
        error: jalurError,
        count: jalurData?.length || 0
      }
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
