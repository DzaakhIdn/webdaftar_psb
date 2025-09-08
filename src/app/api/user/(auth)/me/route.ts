import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase/client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      nama_lengkap: string;
      status_pendaftaran: string;
      role: string;
    };

    // Query database untuk data terbaru
    const { data: userData, error } = await supabase
      .from("calonsiswa")
      .select(
        "id_siswa, register_id, email, nama_lengkap, status_pendaftaran, no_hp, created_at"
      )
      .eq("id_siswa", decoded.id)
      .single();

    if (error || !userData) {
      // Fallback ke data dari JWT jika query database gagal
      return NextResponse.json({
        id: decoded.id,
        email: decoded.email,
        nama_lengkap: decoded.nama_lengkap,
        status_pendaftaran: decoded.status_pendaftaran,
        role: decoded.role,
      });
    }

    // Return data terbaru dari database
    return NextResponse.json({
      id: userData.id_siswa,
      register_id: userData.register_id,
      email: userData.email,
      nama_lengkap: userData.nama_lengkap,
      status_pendaftaran: userData.status_pendaftaran,
      no_hp: userData.no_hp,
      role: decoded.role,
      created_at: userData.created_at,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
