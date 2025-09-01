export interface Registant {
  id_siswa: string;
  register_id: string;
  nama_lengkap: string;
  nik: string;
  kk: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  jalur_final_id: string;
  no_hp: string;
  email: string;
  sekolah_asal: string;
  status_pendaftaran: "pending" | "diterima" | "ditolak" | "sedang tes";
  rt: string;
  rw: string;
  alamat_jalan: string;
  desa_kelurahan: string;
  kecamatan: string;
  kabupaten_kota: string;
  provinsi: string;
  kode_pos: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  pendidikan_ayah: string;
  no_hp_ayah: string;
  penghasilan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  pendidikan_ibu: string;
  no_hp_ibu: string;
  avatar_url?: string; // Add avatar_url field
}
