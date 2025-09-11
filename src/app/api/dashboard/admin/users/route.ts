import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/utils/supabase/server";

// Get all users
export async function GET() {
  try {
    // Fetch both users and no_penting data in parallel
    const [usersResult, noHpResult] = await Promise.all([
      supabase
        .from("users")
        .select(
          "id_user, username, nama_lengkap, role, gender, password_hash, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("no_penting")
        .select(
          "id_nomor, nama_nomor, nomor_hp, user_id, created_at, gender, role"
        )
        .order("created_at", { ascending: false }),
    ]);

    const usersData = usersResult.data || [];
    const noHpData = noHpResult.data || [];

    // Check for errors
    if (usersResult.error) {
      console.error("Error fetching users:", usersResult.error);
      return NextResponse.json(
        { error: "Gagal mengambil data users" },
        { status: 500 }
      );
    }

    if (noHpResult.error) {
      console.error("Error fetching no_penting:", noHpResult.error);
      // Don't fail completely, just log the error
      console.log("Continuing without no_penting data");
    }

    // Enhance users data with their associated phone numbers
    const enhancedUsers = usersData.map((user: any) => {
      // Find phone numbers associated with this user
      const userPhones = noHpData.filter(
        (phone: any) => phone.user_id === user.id_user
      );

      return {
        ...user,
        id: user.id_user, // Add id field for frontend compatibility
        phone_numbers: userPhones,
        total_phones: userPhones.length,
      };
    });

    return NextResponse.json(enhancedUsers);
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
