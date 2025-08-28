import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("API Register: Environment check", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseServiceKey,
  url: supabaseUrl?.substring(0, 20) + "...", // Log partial URL for debugging
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("API Register: Missing environment variables");
  throw new Error("Missing required Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    console.log("API Register: Starting registration process");

    const body = await req.json();
    console.log("API Register: Request body received:", {
      username: body.username,
      nama_lengkap: body.nama_lengkap,
      hasPassword: !!body.password,
    });

    const { username, password, nama_lengkap } = body;

    if (!username || !password || !nama_lengkap) {
      console.log("API Register: Missing required fields");
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    console.log("API Register: Checking if username exists");
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id_user")
      .eq("username", username)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is what we want
      console.error("API Register: Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Gagal memeriksa username" },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log("API Register: Username already exists");
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    console.log("API Register: Hashing password");
    const password_hash = await bcrypt.hash(password, 10);

    console.log("API Register: Inserting user to database");
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          password_hash,
          nama_lengkap,
          role: "admin", // default
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("API Register: Database insert error:", error);
      return NextResponse.json(
        { error: "Gagal register user: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User berhasil didaftarkan",
      user: {
        id: data.id_user,
        username: data.username,
        nama_lengkap: data.nama_lengkap,
      },
    });
  } catch (err) {
    console.error("API Register: Unexpected error:", err);
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
