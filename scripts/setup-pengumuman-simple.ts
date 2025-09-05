import { createClient } from "@supabase/supabase-js";

// ⚠️ TEMPORARY: Replace with your actual Supabase credentials
const SUPABASE_URL = "https://sitriyahsmaitsiid.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdHJpeWFoc21haXRzaWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjU5NzQsImV4cCI6MjA0NzUwMTk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"; // Replace with your actual key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    ).toISOString(),
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
];

async function setupPengumuman() {
  console.log("🚀 Setting up pengumuman...");

  try {
    // Check if table exists
    const { error: selectError } = await supabase
      .from("pengumuman")
      .select("id_pengumuman")
      .limit(1);

    if (selectError) {
      console.error("❌ Table pengumuman does not exist:", selectError.message);
      console.log("📝 Please create the table first using SQL script");
      return;
    }

    console.log("✅ Table pengumuman exists");

    // Insert sample pengumuman
    for (const pengumuman of samplePengumuman) {
      console.log(`📝 Inserting: ${pengumuman.judul}`);

      const { error } = await supabase.from("pengumuman").insert(pengumuman);

      if (error) {
        console.error(`❌ Error inserting ${pengumuman.judul}:`, error.message);
      } else {
        console.log(`✅ ${pengumuman.judul} inserted successfully`);
      }
    }

    // Verify data
    const { data: allPengumuman, error: verifyError } = await supabase
      .from("pengumuman")
      .select("judul, tipe, status")
      .order("prioritas", { ascending: false });

    if (verifyError) {
      console.error("❌ Error verifying:", verifyError.message);
    } else {
      console.log("\n📋 All pengumuman in database:");
      allPengumuman?.forEach((p) => {
        console.log(`- [${p.tipe.toUpperCase()}] ${p.judul}`);
      });
    }

    console.log("\n🎉 Setup completed!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

setupPengumuman();
