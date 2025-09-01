import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE registrant
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log("Deleting registrant with ID:", id);

    // Delete from calonsiswa table
    const { error } = await supabase
      .from("calonsiswa")
      .delete()
      .eq("id_siswa", id);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    return NextResponse.json({ 
      message: "Registrant berhasil dihapus" 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Delete registrant error:", error);
    return NextResponse.json({ 
      error: error.message || "Gagal menghapus registrant" 
    }, { status: 500 });
  }
}
