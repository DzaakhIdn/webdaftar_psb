import { supabase } from "@/utils/supabase/client";

/**
 * Upload contoh file required to Supabase storage
 * 
 * Note: Make sure to create a 'file-required' bucket in Supabase Storage
 * with appropriate policies for authenticated users to upload files.
 */
export async function uploadFileRequiredExample(
  file: File,
  requiredId: string,
  namaFile: string
) {
  try {
    // Get file extension from original file
    const fileExtension = file.name.split(".").pop() || "jpg";

    // Sanitize nama file untuk nama file (hapus karakter yang tidak diizinkan)
    const sanitizedNamaFile = namaFile
      .replace(/[^a-zA-Z0-9\s]/g, "") // hapus karakter khusus
      .replace(/\s+/g, "_") // ganti spasi dengan underscore
      .toLowerCase();

    // Create filename with required ID and sanitized name
    const fileName = `contoh_${sanitizedNamaFile}_${requiredId}.${fileExtension}`;

    const filePath = `examples/${fileName}`;

    // 1️⃣ Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from("file-required") // bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2️⃣ Get public URL
    const { data: urlData } = supabase.storage
      .from("file-required")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    return {
      path_berkas: fileUrl,
      storage_path: filePath,
      nama_berkas: fileName,
    };
  } catch (err) {
    console.error("Upload file required example error:", err);
    throw err;
  }
}

/**
 * Delete file required example from Supabase storage
 */
export async function deleteFileRequiredExample(storagePath: string) {
  try {
    const { error } = await supabase.storage
      .from("file-required")
      .remove([storagePath]);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Delete file required example error:", err);
    throw err;
  }
}
