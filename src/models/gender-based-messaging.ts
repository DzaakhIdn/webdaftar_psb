import { supabase } from "@/utils/supabase/client";
import {
  formatPhoneForWhatsApp,
  generateWhatsAppURL,
} from "./whatsapp-service";

export interface ContactInfo {
  id: string;
  nama_nomor: string;
  nomor_hp: string;
  gender: string;
  role: string;
}

export interface AdminInfo {
  id: string;
  username: string;
  nama_lengkap: string;
  role: string;
  gender?: string;
}

/**
 * Get contacts based on admin's gender and target roles
 */
export async function getContactsByGenderAndRole(
  adminGender: string,
  targetRoles: string[] = ["panitia", "bendahara"]
): Promise<ContactInfo[]> {
  try {
    const { data, error } = await supabase
      .from("no_penting")
      .select("*")
      .in("role", targetRoles)
      .eq("gender", adminGender);

    if (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getContactsByGenderAndRole:", error);
    return [];
  }
}

/**
 * Get contacts (panitia and bendahara) based on admin's gender
 * @deprecated Use getContactsByGenderAndRole instead
 */
export async function getContactsByGender(
  adminGender: string
): Promise<ContactInfo[]> {
  return getContactsByGenderAndRole(adminGender, ["panitia", "bendahara"]);
}

/**
 * Get admin info from current session/token
 */
export async function getCurrentAdminInfo(): Promise<AdminInfo | null> {
  try {
    // Try to get admin info from API endpoint that reads JWT token
    const response = await fetch("/api/dashboard/auth/me", {
      method: "GET",
      credentials: "include", // Include cookies
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.user.id,
        username: data.user.username,
        nama_lengkap: data.user.nama_lengkap,
        role: data.user.role,
        gender: data.user.gender,
      };
    }

    // Fallback: try localStorage for development
    const adminData = localStorage.getItem("admin_info");
    if (adminData) {
      return JSON.parse(adminData);
    }

    return null;
  } catch (error) {
    console.error("Error getting current admin info:", error);
    return null;
  }
}

/**
 * Send WhatsApp message to multiple contacts
 */
export async function sendBulkWhatsAppMessage(
  contacts: ContactInfo[],
  message: string
): Promise<{ success: boolean; results: any[] }> {
  const results = [];

  for (const contact of contacts) {
    try {
      const whatsappURL = generateWhatsAppURL(contact.nomor_hp, message);

      // Open WhatsApp for each contact
      window.open(whatsappURL, "_blank");

      results.push({
        contact: contact.nama_nomor,
        success: true,
        url: whatsappURL,
      });

      // Add small delay between opening multiple WhatsApp windows
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        contact: contact.nama_nomor,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    success: results.some((r) => r.success),
    results,
  };
}

/**
 * Send message to selected roles based on admin's gender
 */
export async function sendGenderBasedMessage(
  message: string,
  targetRoles: string[] = ["panitia", "bendahara"],
  adminInfo?: AdminInfo
): Promise<{ success: boolean; message: string; results?: any[] }> {
  try {
    // Get admin info if not provided
    const admin = adminInfo || (await getCurrentAdminInfo());

    if (!admin) {
      return {
        success: false,
        message: "Informasi admin tidak ditemukan. Silakan login ulang.",
      };
    }

    // Determine gender from admin role or gender field
    let adminGender = admin.gender;
    if (!adminGender) {
      if (admin.role.includes("_ikhwan")) {
        adminGender = "ikhwan";
      } else if (admin.role.includes("_akhwat")) {
        adminGender = "akhwat";
      } else {
        return {
          success: false,
          message:
            "Gender admin tidak dapat ditentukan. Pastikan role admin sudah sesuai.",
        };
      }
    }

    // Get contacts based on admin's gender and target roles
    const contacts = await getContactsByGenderAndRole(adminGender, targetRoles);

    if (contacts.length === 0) {
      const roleText = targetRoles.join(" dan ");
      return {
        success: false,
        message: `Tidak ada kontak ${roleText} ${adminGender} yang ditemukan.`,
      };
    }

    // Send bulk WhatsApp message
    const result = await sendBulkWhatsAppMessage(contacts, message);

    if (result.success) {
      const successCount = result.results.filter((r) => r.success).length;
      const roleText = targetRoles.join(" dan ");
      return {
        success: true,
        message: `Berhasil mengirim pesan ke ${successCount} kontak ${roleText} ${adminGender}.`,
        results: result.results,
      };
    } else {
      return {
        success: false,
        message: "Gagal mengirim pesan ke semua kontak.",
        results: result.results,
      };
    }
  } catch (error) {
    console.error("Error in sendGenderBasedMessage:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak dikenal.",
    };
  }
}

/**
 * Get default message templates for different purposes
 */
export const MESSAGE_TEMPLATES = {
  urgent: `🚨 PESAN PENTING 🚨

Assalamu'alaikum warahmatullahi wabarakatuh

Ada informasi penting yang perlu segera ditindaklanjuti terkait pendaftaran santri baru.

Mohon segera koordinasi untuk penanganan lebih lanjut.

Barakallahu fiikum
Wassalamu'alaikum warahmatullahi wabarakatuh`,

  meeting: `📅 UNDANGAN RAPAT 📅

Assalamu'alaikum warahmatullahi wabarakatuh

Dengan hormat, kami mengundang untuk menghadiri rapat koordinasi:

📅 Hari/Tanggal: [ISI TANGGAL]
🕐 Waktu: [ISI WAKTU]
📍 Tempat: [ISI TEMPAT]
📋 Agenda: [ISI AGENDA]

Mohon kehadiran tepat waktu.

Barakallahu fiikum
Wassalamu'alaikum warahmatullahi wabarakatuh`,

  reminder: `⏰ PENGINGAT ⏰

Assalamu'alaikum warahmatullahi wabarakatuh

Mengingatkan kembali terkait:
[ISI PENGINGAT]

Mohon segera ditindaklanjuti.

Barakallahu fiikum
Wassalamu'alaikum warahmatullahi wabarakatuh`,

  custom: `Assalamu'alaikum warahmatullahi wabarakatuh

[TULIS PESAN ANDA DI SINI]

Barakallahu fiikum
Wassalamu'alaikum warahmatullahi wabarakatuh`,
};
