import { supabase } from "@/utils/supabase/client";

export async function uploadBerkasSiswa(
  file: File,
  siswaId: string,
  requiredId: number
) {
  try {
    // Get required file info to use nama_berkas for filename
    const { data: requiredFileData, error: requiredFileError } = await supabase
      .from("requiredfile")
      .select("nama_berkas")
      .eq("id_required", requiredId)
      .single();

    if (requiredFileError) {
      console.error("Error fetching required file info:", requiredFileError);
    }

    // Get file extension from original file
    const fileExtension = file.name.split(".").pop() || "pdf";

    
    const fileName = requiredFileData?.nama_berkas
      ? `${requiredFileData.nama_berkas.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.${fileExtension}`
      : `${requiredId}-${Date.now()}-${file.name}`;

    const filePath = `${siswaId}/${fileName}`;

    // 1️⃣ Upload ke bucket
    const { error: uploadError } = await supabase.storage
      .from("requiredfile") // bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2️⃣ Ambil public URL
    const { data: urlData } = supabase.storage
      .from("requiredfile")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    const { data: berkas, error: dbError } = await supabase
      .from("berkassiswa")
      .upsert([
        {
          id_siswa: siswaId,
          id_required: requiredId,
          path_berkas: fileUrl,
          nama_berkas: requiredFileData?.nama_berkas || file.name,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return {
      ...berkas,
      storage_path: filePath, // Return storage path for delete operations
    };
  } catch (err) {
    console.error("Upload berkas siswa error:", err);
    throw err;
  }
}
