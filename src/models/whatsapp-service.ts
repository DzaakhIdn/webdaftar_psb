import { supabase } from "@/utils/supabase/client";

export interface WhatsAppTemplate {
  id_text: string;
  text_name: string;
  template: string;
}

export interface RegistrantData {
  id_siswa: string;
  nama_lengkap: string;
  register_id: string;
  no_hp: string;
  status_pendaftaran: "pending" | "diterima" | "ditolak" | "sedang tes";
  password_hash?: string;
  jalurfinal?: {
    nama_jalur_final: string;
  } | null;
}

// Default templates as fallback
const DEFAULT_TEMPLATES: Record<string, string> = {
  pending: `Halo {nama_siswa},

Terima kasih telah mendaftar di sekolah kami dengan nomor pendaftaran {no_daftar}.

Status pendaftaran Anda saat ini: {status}
Jalur pendaftaran: {jalur}

Mohon tunggu informasi selanjutnya dari kami.

Terima kasih.`,

  diterima: `Selamat {nama_siswa}! 🎉

Kami dengan senang hati memberitahukan bahwa Anda telah DITERIMA di sekolah kami.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Password untuk login sistem: {password_hash}

Silakan simpan password ini dengan baik dan segera login ke sistem untuk melengkapi data Anda.

Selamat bergabung dengan keluarga besar sekolah kami!

Terima kasih.`,

  ditolak: `Halo {nama_siswa},

Terima kasih atas minat Anda untuk bergabung dengan sekolah kami.

Setelah melalui proses seleksi yang ketat, kami mohon maaf harus memberitahukan bahwa pendaftaran Anda dengan nomor {no_daftar} belum dapat kami terima pada periode ini.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Jangan berkecil hati, Anda dapat mencoba mendaftar kembali pada periode pendaftaran berikutnya.

Terima kasih atas pengertiannya.`,

  "sedang tes": `Halo {nama_siswa},

Selamat! Anda telah lolos tahap administrasi dan akan mengikuti tahap selanjutnya.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Mohon persiapkan diri Anda dengan baik untuk tahap selanjutnya. Informasi lebih lanjut akan kami sampaikan segera.

Semoga sukses!

Terima kasih.`,
};

/**
 * Get template message by status
 */
export async function getTemplateByStatus(
  status: string
): Promise<WhatsAppTemplate | null> {
  try {
    // Try to get template from database first
    const { data, error } = await supabase
      .from("text_template")
      .select("*")
      .eq("text_name", status)
      .single();

    if (error) {
      console.warn("Error fetching template from database:", error.message);
      console.log("Using default template for status:", status);

      // Use default template as fallback
      const defaultTemplate = DEFAULT_TEMPLATES[status];
      if (defaultTemplate) {
        return {
          id_text: `default-${status}`,
          text_name: status,
          template: defaultTemplate,
        };
      }

      // If no default template exists, return generic template
      return {
        id_text: `generic-${status}`,
        text_name: status,
        template: `Halo {nama_siswa},

Status pendaftaran Anda: {status}
Nomor pendaftaran: {no_daftar}
Jalur: {jalur}

Terima kasih.`,
      };
    }

    return data;
  } catch (error) {
    console.error("Error in getTemplateByStatus:", error);

    // Use default template as fallback
    const defaultTemplate = DEFAULT_TEMPLATES[status];
    if (defaultTemplate) {
      return {
        id_text: `default-${status}`,
        text_name: status,
        template: defaultTemplate,
      };
    }

    return null;
  }
}

export function replaceTemplatePlaceholders(
  template: string,
  registrantData: RegistrantData
): string {
  // Validasi template tidak null/undefined
  if (!template) {
    console.error("Template is null or undefined");
    return "Template pesan tidak tersedia";
  }

  // Validasi registrantData
  if (!registrantData) {
    console.error("RegistrantData is null or undefined");
    return "Data pendaftar tidak tersedia";
  }

  return template
    .replace(
      /{nama_siswa}/g,
      registrantData.nama_lengkap || "Nama tidak tersedia"
    )
    .replace(
      /{no_daftar}/g,
      registrantData.register_id || "Nomor tidak tersedia"
    )
    .replace(
      /{jalur}/g,
      registrantData.jalurfinal?.nama_jalur_final || "Belum ditentukan"
    )
    .replace(
      /{status}/g,
      getWhatsAppStatusLabel(registrantData.status_pendaftaran)
    )
    .replace(
      /{password_hash}/g,
      registrantData.password_hash || "Password belum tersedia"
    );
}

/**
 * Get status label in Indonesian for WhatsApp messages
 */
export function getWhatsAppStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    pending: "Menunggu Verifikasi",
    diterima: "Diterima",
    ditolak: "Ditolak",
    "sedang tes": "Sedang Tes",
  };

  return statusLabels[status] || status;
}

/**
 * Format phone number for WhatsApp (remove leading 0, add +62)
 */
export function formatPhoneForWhatsApp(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // If starts with 0, replace with 62
  if (cleaned.startsWith("0")) {
    return `62${cleaned.substring(1)}`;
  }

  // If starts with 62, keep as is
  if (cleaned.startsWith("62")) {
    return cleaned;
  }

  // Otherwise, assume it's local number and add 62
  return `62${cleaned}`;
}

/**
 * Generate WhatsApp URL with message
 */
export function generateWhatsAppURL(
  phoneNumber: string,
  message: string
): string {
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Send WhatsApp message (opens WhatsApp with pre-filled message)
 */
export async function sendWhatsAppMessage(
  registrantData: RegistrantData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Get template based on status
    const template = await getTemplateByStatus(
      registrantData.status_pendaftaran
    );

    if (!template) {
      return {
        success: false,
        error: `Template untuk status "${registrantData.status_pendaftaran}" tidak ditemukan`,
      };
    }

    if (!template.template) {
      return {
        success: false,
        error: `Template pesan untuk status "${registrantData.status_pendaftaran}" kosong`,
      };
    }

    // Replace placeholders with actual data
    const message = replaceTemplatePlaceholders(
      template.template,
      registrantData
    );

    // Generate WhatsApp URL
    const whatsappURL = generateWhatsAppURL(registrantData.no_hp, message);

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    return {
      success: true,
      url: whatsappURL,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Log WhatsApp message sending (optional - for tracking)
 */
export async function logWhatsAppMessage(
  registrantId: string,
  phoneNumber: string,
  message: string,
  status: "sent" | "failed"
): Promise<void> {
  try {
    await supabase.from("whatsapp_logs").insert({
      registrant_id: registrantId,
      phone_number: phoneNumber,
      message: message,
      status: status,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging WhatsApp message:", error);
    // Don't throw error, just log it
  }
}
