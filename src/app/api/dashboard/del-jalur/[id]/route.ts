import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE jalur + jalurfinal
export async function DELETE(
  req: NextRequest, // Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Hapus jalurfinal dulu (karena ada FK ke jalur)
    const { error: jalurFinalError } = await supabase
      .from("jalurfinal")
      .delete()
      .eq("id_jalur", id);

    if (jalurFinalError) throw jalurFinalError;

    // Baru hapus jalur utama
    const { error: jalurError } = await supabase
      .from("jalur")
      .delete()
      .eq("id_jalur", id);

    if (jalurError) throw jalurError;

    return NextResponse.json({ message: "Delete berhasil" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
