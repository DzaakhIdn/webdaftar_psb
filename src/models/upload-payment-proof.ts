import { supabase } from "@/utils/supabase/client";

/**
 * Upload bukti pembayaran to Supabase storage
 *
 * Note: Make sure to create a 'bukti-bayar' bucket in Supabase Storage
 * with appropriate policies for authenticated users to upload files.
 */
export async function uploadBuktiPembayaran(
  file: File,
  siswaId: number,
  namaSiswa: string,
) {
  try {
    // Get file extension from original file
    const fileExtension = file.name.split(".").pop() || "pdf";

    // Sanitize nama siswa untuk nama folder (hapus karakter yang tidak diizinkan)
    const sanitizedNamaSiswa = namaSiswa
      .replace(/[^a-zA-Z0-9\s]/g, "") // hapus karakter khusus
      .replace(/\s+/g, "_") // ganti spasi dengan underscore
      .toLowerCase();

    // Create filename with timestamp and payment info
    const fileName = `bukti_pembayaran_${namaSiswa}.${fileExtension}`;

    const filePath = `${sanitizedNamaSiswa}/${fileName}`;

    // 1️⃣ Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from("bukti-bayar") // bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2️⃣ Get public URL
    const { data: urlData } = supabase.storage
      .from("bukti-bayar")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    return {
      path_berkas: fileUrl,
      storage_path: filePath,
      nama_berkas: fileName,
    };
  } catch (err) {
    console.error("Upload bukti pembayaran error:", err);
    throw err;
  }
}
