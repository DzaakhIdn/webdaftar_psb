import { NextResponse } from "next/server";
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
      .select("id_user, username, password_hash, nama_lengkap, role, gender")
      .eq("username", username)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // cek password - decode base64 dan compare
    let isPasswordValid = false;
    try {
      const decodedPassword = Buffer.from(
        data.password_hash,
        "base64"
      ).toString("utf-8");
      isPasswordValid = password === decodedPassword;
    } catch (error) {
      console.error("Error decoding password:", error);
      isPasswordValid = false;
    }

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
        nama_lengkap: data.nama_lengkap,
        role: data.role,
        gender: data.gender,
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
        gender: data.gender,
      },
    });

    response.cookies.set("token_dashboard", token, {
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
