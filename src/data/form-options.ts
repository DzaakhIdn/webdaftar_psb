// Data opsi untuk form registrasi

// Opsi pendidikan
export const educationOptions = [
  "SD/Sederajat",
  "SMP/Sederajat", 
  "SMA/SMK/Sederajat",
  "D1/D2/D3",
  "S1/Sarjana",
  "S2/Magister",
  "S3/Doktor",
  "Tidak Sekolah"
] as const;

// Opsi penghasilan
export const incomeOptions = [
  "< Rp 1.000.000",
  "Rp 1.000.000 - Rp 2.500.000",
  "Rp 2.500.000 - Rp 5.000.000", 
  "Rp 5.000.000 - Rp 10.000.000",
  "> Rp 10.000.000"
] as const;

// Types untuk type safety
export type Education = typeof educationOptions[number];
export type Income = typeof incomeOptions[number];
