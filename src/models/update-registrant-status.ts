import { supabase } from "@/utils/supabase/client";

export type RegistrantStatus =
  | "pending"
  | "verifikasi berkas"
  | "verifikasi pembayaran"
  | "tes wawancara"
  | "sedang tes"
  | "diterima"
  | "ditolak";

export interface UpdateStatusData {
  status_pendaftaran: RegistrantStatus;
  updated_at?: string;
}

/**
 * Update registrant status
 */
export async function updateRegistrantStatus(
  registrantId: string,
  newStatus: RegistrantStatus
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const updateData: UpdateStatusData = {
      status_pendaftaran: newStatus,
    };

    const { data, error } = await supabase
      .from("calonsiswa")
      .update(updateData)
      .eq("id_siswa", registrantId)
      .select(
        `
        id_siswa,
        nama_lengkap,
        register_id,
        no_hp,
        status_pendaftaran,
        jalur_final_id,
        password_hash,
        jalurfinal (
          nama_jalur_final,
          jalur (nama_jalur)
        )
      `
      )
      .single();

    if (error) {
      console.error("Error updating registrant status:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error in updateRegistrantStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get status options for dropdown
 */
export const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu Verifikasi", color: "warning" },
  { value: "verifikasi berkas", label: "Verifikasi Berkas", color: "info" },
  {
    value: "verifikasi pembayaran",
    label: "Verifikasi Pembayaran",
    color: "info",
  },
  { value: "sedang tes", label: "Sedang Tes", color: "info" },
  { value: "tes wawancara", label: "Tes Wawancara", color: "primary" },
  { value: "diterima", label: "Diterima", color: "success" },
  { value: "ditolak", label: "Ditolak", color: "error" },
] as const;

/**
 * Get status color for display
 */
export function getStatusColor(
  status: RegistrantStatus
): "warning" | "success" | "error" | "info" {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === status);
  return statusOption?.color || "warning";
}

/**
 * Get status label in Indonesian
 */
export function getStatusLabel(status: RegistrantStatus): string {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === status);
  return statusOption?.label || status;
}

/**
 * Validate status value
 */
export function isValidStatus(status: string): status is RegistrantStatus {
  return STATUS_OPTIONS.some((option) => option.value === status);
}
