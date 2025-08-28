import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const jwtSecret = process.env.JWT_SECRET!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try { 
    const body = await req.json();
    const { username, password } = body;

    // cari user di DB
    const { data, error } = await supabase
      .from("users")
      .select("id_user, username, password_hash, nama_lengkap, role")
      .eq("username", username)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // cek password
    const isPasswordValid = await bcrypt.compare(password, data.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // bikin token JWT
    const token = jwt.sign(
      {
        id: data.id_user,
        username: data.username,
        role: data.role,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // set cookie httpOnly
    const response = NextResponse.json({
      message: "Login success",
      user: {
        id: data.id_user,
        username: data.username,
        nama_lengkap: data.nama_lengkap,
        role: data.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 jam
    });

    return response;
  } catch (err) {
    console.error("API Login: Unexpected error:", err);
    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan server: " +
          (err instanceof Error ? err.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
