import { supabase } from "@/utils/supabase/client";

export const handleAvatarUpload = async (file: File, username: string) => {
  const fileText = file.name.split(".").pop();
  const fileName = `avatar_${username}.${fileText}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }

  const { data: publicUrl } = await supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return publicUrl;
};
