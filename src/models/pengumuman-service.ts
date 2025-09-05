import { supabase } from "@/utils/supabase/client";

export interface Pengumuman {
  id_pengumuman: string;
  judul: string;
  konten: string;
  tipe: 'info' | 'penting' | 'urgent' | 'sukses' | 'peringatan';
  status: 'aktif' | 'nonaktif' | 'draft';
  tanggal_mulai: string;
  tanggal_berakhir?: string | null;
  target_audience: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  prioritas: number;
  dibuat_oleh?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePengumumanData {
  judul: string;
  konten: string;
  tipe: 'info' | 'penting' | 'urgent' | 'sukses' | 'peringatan';
  status: 'aktif' | 'nonaktif' | 'draft';
  tanggal_mulai: string;
  tanggal_berakhir?: string | null;
  target_audience: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  prioritas: number;
}

/**
 * Get all active announcements
 */
export async function getActivePengumuman(
  targetAudience?: string
): Promise<Pengumuman[]> {
  try {
    let query = supabase
      .from("pengumuman")
      .select("*")
      .eq("status", "aktif")
      .lte("tanggal_mulai", new Date().toISOString())
      .or(`tanggal_berakhir.is.null,tanggal_berakhir.gt.${new Date().toISOString()}`)
      .order("prioritas", { ascending: false })
      .order("created_at", { ascending: false });

    if (targetAudience && targetAudience !== 'semua') {
      query = query.in("target_audience", ["semua", targetAudience]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching pengumuman:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getActivePengumuman:", error);
    return [];
  }
}

/**
 * Get all announcements for admin management
 */
export async function getAllPengumuman(): Promise<Pengumuman[]> {
  try {
    const { data, error } = await supabase
      .from("pengumuman")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all pengumuman:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllPengumuman:", error);
    return [];
  }
}

/**
 * Create new announcement
 */
export async function createPengumuman(
  data: CreatePengumumanData
): Promise<{ success: boolean; data?: Pengumuman; error?: string }> {
  try {
    const { data: result, error } = await supabase
      .from("pengumuman")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error creating pengumuman:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error in createPengumuman:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Update announcement
 */
export async function updatePengumuman(
  id: string,
  data: Partial<CreatePengumumanData>
): Promise<{ success: boolean; data?: Pengumuman; error?: string }> {
  try {
    const { data: result, error } = await supabase
      .from("pengumuman")
      .update(data)
      .eq("id_pengumuman", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating pengumuman:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error in updatePengumuman:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Delete announcement
 */
export async function deletePengumuman(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("pengumuman")
      .delete()
      .eq("id_pengumuman", id);

    if (error) {
      console.error("Error deleting pengumuman:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in deletePengumuman:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get announcement type color and icon
 */
export function getPengumumanTypeConfig(tipe: Pengumuman['tipe']) {
  const configs = {
    info: {
      color: 'info' as const,
      icon: 'eva:info-fill',
      bgColor: 'rgba(0, 184, 217, 0.08)',
      textColor: 'rgb(0, 184, 217)'
    },
    penting: {
      color: 'warning' as const,
      icon: 'eva:alert-triangle-fill',
      bgColor: 'rgba(255, 171, 0, 0.08)',
      textColor: 'rgb(255, 171, 0)'
    },
    urgent: {
      color: 'error' as const,
      icon: 'eva:alert-circle-fill',
      bgColor: 'rgba(255, 86, 48, 0.08)',
      textColor: 'rgb(255, 86, 48)'
    },
    sukses: {
      color: 'success' as const,
      icon: 'eva:checkmark-circle-2-fill',
      bgColor: 'rgba(34, 197, 94, 0.08)',
      textColor: 'rgb(34, 197, 94)'
    },
    peringatan: {
      color: 'warning' as const,
      icon: 'eva:alert-triangle-outline',
      bgColor: 'rgba(255, 171, 0, 0.08)',
      textColor: 'rgb(255, 171, 0)'
    }
  };

  return configs[tipe] || configs.info;
}

/**
 * Format date for display
 */
export function formatTanggalPengumuman(tanggal: string): string {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
