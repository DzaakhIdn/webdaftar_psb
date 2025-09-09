import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase/client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_dashboard")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
      role: string;
    };

    // Fetch complete user data from database
    const { data: userData, error } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, created_at")
      .eq("id_user", decoded.id)
      .single();

    if (error || !userData) {
      // Return basic data from JWT if database query fails
      return NextResponse.json({
        id: decoded.id,
        username: decoded.username,
        nama_lengkap: decoded.username,
        role: decoded.role,
        email: `${decoded.username}@admin.system`,
      });
    }

    return NextResponse.json({
      id: userData.id_user,
      username: userData.username,
      nama_lengkap: userData.nama_lengkap,
      role: userData.role,
      email: `${userData.username}@admin.system`,
      created_at: userData.created_at,
    });
  } catch (error) {
    console.error("Error fetching admin user data:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
