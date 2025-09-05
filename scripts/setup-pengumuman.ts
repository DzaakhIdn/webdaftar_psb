import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env.local manually
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const envFile = readFileSync(envPath, "utf8");

    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.error("❌ Could not load .env.local file");
    console.error(
      "Please make sure .env.local exists with SUPABASE credentials"
    );
    process.exit(1);
  }
}

// Load environment variables
loadEnvFile();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not defined in .env.local");
  process.exit(1);
}

if (!supabaseKey) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in .env.local"
  );
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");
const supabase = createClient(supabaseUrl, supabaseKey);

const samplePengumuman = [
  {
    judul: "Selamat Datang di Sistem Pendaftaran",
    konten: `Selamat datang di sistem pendaftaran online sekolah kami. 

Silakan lengkapi data pendaftaran Anda dengan benar dan upload dokumen yang diperlukan.

Pastikan semua informasi yang Anda berikan adalah akurat dan sesuai dengan dokumen asli.

Jika ada pertanyaan, silakan hubungi panitia pendaftaran.`,
    tipe: "info",
    status: "aktif",
    target_audience: "calon_siswa",
    prioritas: 1,
    tanggal_mulai: new Date().toISOString(),
    tanggal_berakhir: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from now
    dibuat_oleh: "admin",
  },
  {
    judul: "Batas Waktu Pendaftaran Diperpanjang",
    konten: `PENTING: Batas waktu pendaftaran telah diperpanjang hingga tanggal 31 Desember 2024.

Jangan lewatkan kesempatan ini untuk bergabung dengan sekolah kami!

Segera lengkapi berkas pendaftaran Anda sebelum batas waktu berakhir.

Pendaftaran yang tidak lengkap tidak akan diproses.`,
    tipe: "penting",
    status: "aktif",
    target_audience: "semua",
    prioritas: 3,
    tanggal_mulai: new Date().toISOString(),
    tanggal_berakhir: "2024-12-31T23:59:59.000Z",
    dibuat_oleh: "admin",
  },
  {
    judul: "Jadwal Tes Masuk Tahap 1",
    konten: `URGENT: Tes masuk tahap 1 akan dilaksanakan pada:

📅 Tanggal: 15 Januari 2025
🕐 Waktu: 08:00 - 12:00 WIB
📍 Lokasi: Gedung Utama Sekolah

Peserta yang lolos seleksi administrasi akan dihubungi melalui WhatsApp.

Harap datang 30 menit sebelum tes dimulai dan membawa:
- Kartu identitas
- Alat tulis
- Kartu peserta tes

Semoga sukses!`,
    tipe: "urgent",
    status: "aktif",
    target_audience: "calon_siswa",
    prioritas: 5,
    tanggal_mulai: new Date().toISOString(),
    tanggal_berakhir: "2025-01-20T00:00:00.000Z",
    dibuat_oleh: "admin",
  },
  {
    judul: "Sistem Maintenance Terjadwal",
    konten: `⚠️ PERINGATAN: Sistem akan mengalami maintenance pada:

📅 Hari: Minggu, 10 Desember 2024
🕐 Waktu: 02:00 - 06:00 WIB

Selama periode ini, sistem tidak dapat diakses.

Mohon maaf atas ketidaknyamanannya dan terima kasih atas pengertian Anda.

Silakan akses sistem kembali setelah pukul 06:00 WIB.`,
    tipe: "peringatan",
    status: "aktif",
    target_audience: "semua",
    prioritas: 4,
    tanggal_mulai: new Date().toISOString(),
    tanggal_berakhir: "2024-12-10T06:00:00.000Z",
    dibuat_oleh: "admin",
  },
  {
    judul: "Pengumuman Hasil Seleksi Tahap 1",
    konten: `🎉 Selamat kepada peserta yang lolos seleksi tahap 1!

Hasil seleksi telah diumumkan dan dapat dilihat di sistem.

Bagi yang lolos, silakan:
1. Login ke sistem untuk melihat detail
2. Persiapkan diri untuk tahap selanjutnya
3. Pantau pengumuman untuk informasi lebih lanjut

Bagi yang belum berhasil, jangan berkecil hati. Tetap semangat untuk kesempatan berikutnya!

Terima kasih atas partisipasi semua peserta.`,
    tipe: "sukses",
    status: "aktif",
    target_audience: "calon_siswa",
    prioritas: 4,
    tanggal_mulai: new Date().toISOString(),
    tanggal_berakhir: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days from now
    dibuat_oleh: "admin",
  },
];

async function setupPengumuman() {
  console.log("🚀 Setting up pengumuman...");

  try {
    // Check if table exists by trying to select from it
    const { error: selectError } = await supabase
      .from("pengumuman")
      .select("id_pengumuman")
      .limit(1);

    if (selectError) {
      console.error(
        "❌ Table pengumuman does not exist or is not accessible:",
        selectError.message
      );
      console.log(
        "📝 Please create the table first using the SQL script in database/create-pengumuman-table.sql"
      );
      return;
    }

    console.log("✅ Table pengumuman exists");

    // Insert sample pengumuman
    for (const pengumuman of samplePengumuman) {
      console.log(`📝 Inserting pengumuman: ${pengumuman.judul}`);

      const { error } = await supabase
        .from("pengumuman")
        .insert(pengumuman)
        .select();

      if (error) {
        console.error(
          `❌ Error inserting pengumuman ${pengumuman.judul}:`,
          error
        );
      } else {
        console.log(`✅ Pengumuman ${pengumuman.judul} inserted successfully`);
      }
    }

    // Verify data
    const { data: allPengumuman, error: verifyError } = await supabase
      .from("pengumuman")
      .select("judul, tipe, status, target_audience, prioritas")
      .order("prioritas", { ascending: false });

    if (verifyError) {
      console.error("❌ Error verifying pengumuman:", verifyError);
    } else {
      console.log("\n📋 All pengumuman in database:");
      allPengumuman?.forEach((pengumuman) => {
        console.log(
          `- [${pengumuman.tipe.toUpperCase()}] ${pengumuman.judul} (P${
            pengumuman.prioritas
          })`
        );
      });
    }

    console.log("\n🎉 Pengumuman setup completed!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Run the setup
setupPengumuman();
