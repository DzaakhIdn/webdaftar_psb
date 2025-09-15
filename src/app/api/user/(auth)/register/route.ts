import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("API Register: Environment check", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseServiceKey,
  url: supabaseUrl?.substring(0, 20) + "...",
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
      email: body.email,
      nama_lengkap: body.nama_lengkap,
      no_hp: body.no_hp,
      jenis_kelamin: body.jenis_kelamin,
      jalur_final_id: body.jalur_final_id,
      hasPassword: !!body.password,
    });

    const {
      email,
      password,
      nama_lengkap,
      no_hp,
      jenis_kelamin,
      jalur_final_id,
    } = body;

    if (
      !email ||
      !password ||
      !nama_lengkap ||
      !no_hp ||
      !jenis_kelamin ||
      !jalur_final_id
    ) {
      console.log("API Register: Missing required fields");
      return NextResponse.json(
        {
          error:
            "Semua field wajib diisi termasuk jenis kelamin dan jalur pendaftaran",
        },
        { status: 400 }
      );
    }

    // Cek apakah email sudah ada
    console.log("API Register: Checking if email exists");
    const { data: existingUser, error: checkError } = await supabase
      .from("calonsiswa")
      .select("id_siswa")
      .eq("email", body.email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is what we want
      console.error("API Register: Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Gagal memeriksa email" },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log("API Register: email already exists");
      return NextResponse.json(
        { error: "email sudah digunakan" },
        { status: 400 }
      );
    }

    const lastuser = await supabase
      .from("calonsiswa")
      .select("register_id")
      .order("register_id", { ascending: false })
      .limit(1)
      .single();

    let newId = "PSBHSI0001";
    if (lastuser.data) {
      const last_num = parseInt(
        lastuser.data.register_id.replace("PSBHSI", "")
      );
      newId = `PSBHSI${(last_num + 1).toString().padStart(4, "0")}`;
    }

    console.log("API Register: Encoding password to base64");
    const password_hash = Buffer.from(password, "utf-8").toString("base64");

    console.log("API Register: Inserting user to database");
    const { data, error } = await supabase
      .from("calonsiswa")
      .insert([
        {
          register_id: newId,
          password_hash,
          email,
          nama_lengkap,
          no_hp,
          jenis_kelamin,
          jalur_final_id,
          status_pendaftaran: "pending",
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
        id: data.id_siswa,
        register_id: data.register_id,
        email: data.email,
        nama_lengkap: data.nama_lengkap,
        no_hp: data.no_hp,
        jenis_kelamin: data.jenis_kelamin,
        jalur_final_id: data.jalur_final_id,
        status_pendaftaran: data.status_pendaftaran,
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
