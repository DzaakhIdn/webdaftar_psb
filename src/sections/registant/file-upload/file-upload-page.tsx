"use client";

import { useState, useCallback, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { FileUpload } from "./file-upload";
import { showAllData, deleteData } from "@/models";
import { uploadBerkasSiswa } from "@/models/upload-filereq";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { useToast } from "@/components/providers/toast-provider";
import { supabase } from "@/utils/supabase/client";

interface RequiredFile {
  id_required: string;
  nama_berkas: string;
  deskripsi: string;
  wajib: boolean;
}

export function FileUploadPage() {
  const [requiredFiles, setRequiredFiles] = useState<RequiredFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const { showSuccess, showError } = useToast();
  const [existingFiles, setExistingFiles] = useState<Record<string, string>>(
    {}
  );
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>(
    {}
  );
  const { user: currentUser, loading: userLoading } =
    useCurrentUser("/api/user/me");

  useEffect(() => {
    const fetchRequiredFiles = async () => {
      try {
        const data = await showAllData("requiredfile");
        setRequiredFiles(data);
      } catch (error) {
        console.error("Error fetching required files:", error);
        // Only show error if it's not a network/connection issue
        if (error?.message && !error.message.includes("Failed to fetch")) {
          showError("Gagal memuat daftar berkas yang diperlukan");
        }
      }
    };

    fetchRequiredFiles();
  }, [showError]);

  useEffect(() => {
    const fetchExistingFiles = async () => {
      if (!currentUser?.id) return;

      try {
        const existingBerkas = await showAllData("berkassiswa");

        const userFiles = existingBerkas.filter(
          (berkas: any) => String(berkas.id_siswa) === String(currentUser.id)
        );

        const filesMap: Record<string, string> = {};
        userFiles.forEach((berkas: any) => {
          if (berkas.path_berkas) {
            filesMap[String(berkas.id_required)] = berkas.path_berkas;
          }
        });

        setExistingFiles(filesMap);
      } catch (error) {
        console.error("Error fetching existing files:", error);
      }
    };

    fetchExistingFiles();
  }, [currentUser]);

  const handleFileDrop = useCallback(
    (fileId: string) => {
      return async (acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0];
        if (!newFile || !currentUser?.id) {
          showError("File tidak valid atau user belum login");
          return;
        }

        // Validate file size (max 5MB)
        if (newFile.size > 5 * 1024 * 1024) {
          showError("Ukuran file terlalu besar! Maksimal 5MB");
          return;
        }

        // Validate file type (images and PDFs)
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/JPG",
          "image/png",
          "image/gif",
          "application/pdf",
        ];
        if (!allowedTypes.includes(newFile.type)) {
          showError(
            "Tipe file tidak didukung! Gunakan JPG, PNG, GIF, atau PDF"
          );
          return;
        }

        try {
          // Set loading state
          setUploadingFiles((prev) => ({ ...prev, [fileId]: true }));

          // Show preview immediately
          setUploadedFiles((prev) => ({
            ...prev,
            [fileId]: newFile,
          }));
          const result = await uploadBerkasSiswa(
            newFile,
            String(currentUser.id),
            parseInt(fileId)
          );

          // Update existing files state with new URL
          if (result?.path_berkas) {
            setExistingFiles((prev) => ({
              ...prev,
              [fileId]: result.path_berkas,
            }));
          }

          showSuccess(`Berkas ${newFile.name} berhasil diupload!`);
        } catch (error) {
          showError(
            `Gagal upload berkas: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );

          // Remove file from state if upload failed
          setUploadedFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
        } finally {
          // Remove loading state
          setUploadingFiles((prev) => ({ ...prev, [fileId]: false }));
        }
      };
    },
    [currentUser]
  );

  const handleFileDelete = useCallback(
    (fileId: string) => {
      return async () => {
        if (!currentUser?.id) {
          showError("User belum login");
          return;
        }

        try {
          const { data: fileInfo } = await supabase
            .from("berkassiswa")
            .select("path_berkas")
            .eq("id_siswa", String(currentUser.id))
            .eq("id_required", parseInt(fileId))
            .single();

          // Delete from database first
          await supabase
            .from("berkassiswa")
            .delete()
            .eq("id_siswa", String(currentUser.id))
            .eq("id_required", parseInt(fileId));

          // Delete from storage bucket if file exists
          if (fileInfo?.path_berkas) {
            // Extract file path from URL
            const url = new URL(fileInfo.path_berkas);
            const pathParts = url.pathname.split("/");

            const bucketIndex = pathParts.indexOf("requiredfile");
            if (bucketIndex !== -1 && bucketIndex + 2 < pathParts.length) {
              const storagePath = pathParts.slice(bucketIndex + 1).join("/");

              console.log("Deleting from storage:", storagePath);

              const { error: storageError } = await supabase.storage
                .from("requiredfile")
                .remove([storagePath]);

              if (storageError) {
                console.error("Storage delete error:", storageError);
              } else {
                console.log("File deleted from storage successfully");
              }
            } else {
              console.error(
                "Could not extract storage path from URL:",
                fileInfo.path_berkas
              );
            }
          }

          // Remove from uploaded files
          setUploadedFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });

          // Remove from existing files
          setExistingFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });

          showSuccess("Berkas berhasil dihapus dari database dan storage!");
        } catch (error) {
          console.error("Delete error:", error);
          showError("Gagal menghapus berkas");
        }
      };
    },
    [currentUser]
  );

  return (
    <Box className="flex flex-col gap-5">
      {requiredFiles.map((file) => {
        const existingUrl = existingFiles[file.id_required];
        const uploadedFile = uploadedFiles[file.id_required];

        // console.log(`File ${file.id_required}:`, {
        //   existingUrl,
        //   uploadedFile,
        //   hasExisting: !!existingUrl,
        //   hasUploaded: !!uploadedFile,
        // });

        return (
          <FileUpload
            key={file.id_required}
            title={file.nama_berkas}
            optional={!file.wajib}
            description={file.deskripsi}
            value={uploadedFile}
            existingFileUrl={existingUrl}
            loading={uploadingFiles[file.id_required] || false}
            onDrop={handleFileDrop(file.id_required)}
            onDelete={handleFileDelete(file.id_required)}
          />
        );
      })}
    </Box>
  );
}
