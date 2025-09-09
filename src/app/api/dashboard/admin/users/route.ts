import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get all users
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id_user, username, nama_lengkap, role, password_hash, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data users" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// Add new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password_hash, nama_lengkap, role, gender } = body;

    // Validasi input
    if (!username || !password_hash || !nama_lengkap || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id_user")
      .eq("username", username)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Gagal memeriksa username" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Encode password to base64
    const encodedPassword = Buffer.from(password_hash, "utf-8").toString(
      "base64"
    );

    // Auto-set gender based on role if not provided
    let finalGender = gender;
    if (!finalGender) {
      if (role.includes("_ikhwan")) {
        finalGender = "ikhwan";
      } else if (role.includes("_akhwat")) {
        finalGender = "akhwat";
      }
    }

    // Insert user ke database
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          password_hash: encodedPassword,
          nama_lengkap,
          role,
          gender: finalGender,
        },
      ])
      .select(
        "id_user, username, nama_lengkap, role, gender, password_hash, created_at"
      )
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json(
        { error: "Gagal menambah user: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User berhasil ditambahkan",
      user: data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
