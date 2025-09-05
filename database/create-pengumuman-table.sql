-- Create pengumuman table for announcements (WITHOUT RLS)
CREATE TABLE IF NOT EXISTS public.pengumuman (
  id_pengumuman UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  tipe VARCHAR(50) DEFAULT 'info' CHECK (tipe IN ('info', 'penting', 'urgent', 'sukses', 'peringatan')),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'draft')),
  tanggal_mulai TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tanggal_berakhir TIMESTAMP WITH TIME ZONE,
  target_audience VARCHAR(50) DEFAULT 'semua' CHECK (target_audience IN ('semua', 'calon_siswa', 'admin', 'panitia')),
  prioritas INTEGER DEFAULT 1 CHECK (prioritas BETWEEN 1 AND 5),
  dibuat_oleh VARCHAR(100) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pengumuman_status ON public.pengumuman(status);
CREATE INDEX IF NOT EXISTS idx_pengumuman_tipe ON public.pengumuman(tipe);
CREATE INDEX IF NOT EXISTS idx_pengumuman_target ON public.pengumuman(target_audience);
CREATE INDEX IF NOT EXISTS idx_pengumuman_prioritas ON public.pengumuman(prioritas DESC);
CREATE INDEX IF NOT EXISTS idx_pengumuman_tanggal ON public.pengumuman(tanggal_mulai, tanggal_berakhir);

-- NO RLS - Table is publicly accessible

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pengumuman_updated_at 
  BEFORE UPDATE ON public.pengumuman 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample pengumuman data
INSERT INTO public.pengumuman (judul, konten, tipe, status, target_audience, prioritas, tanggal_berakhir, dibuat_oleh)
VALUES 
  (
    'Selamat Datang di Sistem Pendaftaran',
    'Selamat datang di sistem pendaftaran online sekolah kami. Silakan lengkapi data pendaftaran Anda dengan benar dan upload dokumen yang diperlukan.',
    'info',
    'aktif',
    'calon_siswa',
    1,
    NOW() + INTERVAL '30 days',
    'admin'
  ),
  (
    'Batas Waktu Pendaftaran Diperpanjang',
    'Batas waktu pendaftaran telah diperpanjang hingga tanggal 31 Desember 2024. Jangan lewatkan kesempatan ini untuk bergabung dengan sekolah kami!',
    'penting',
    'aktif',
    'semua',
    3,
    '2024-12-31 23:59:59',
    'admin'
  ),
  (
    'Jadwal Tes Masuk',
    'Tes masuk akan dilaksanakan pada tanggal 15 Januari 2025. Peserta yang lolos seleksi administrasi akan dihubungi melalui WhatsApp.',
    'urgent',
    'aktif',
    'calon_siswa',
    5,
    '2025-01-20 00:00:00',
    'admin'
  ),
  (
    'Sistem Maintenance',
    'Sistem akan mengalami maintenance pada hari Minggu, 10 Desember 2024 pukul 02:00 - 06:00 WIB. Mohon maaf atas ketidaknyamanannya.',
    'peringatan',
    'aktif',
    'semua',
    4,
    '2024-12-10 06:00:00',
    'admin'
  )
ON CONFLICT DO NOTHING;

-- Create view for active announcements
CREATE OR REPLACE VIEW public.pengumuman_aktif AS
SELECT 
  id_pengumuman,
  judul,
  konten,
  tipe,
  target_audience,
  prioritas,
  tanggal_mulai,
  tanggal_berakhir,
  created_at
FROM public.pengumuman
WHERE status = 'aktif'
  AND (tanggal_berakhir IS NULL OR tanggal_berakhir > NOW())
  AND tanggal_mulai <= NOW()
ORDER BY prioritas DESC, created_at DESC;

-- Verify the table and data
SELECT 
  judul, 
  tipe, 
  status, 
  target_audience, 
  prioritas,
  LEFT(konten, 50) || '...' as konten_preview 
FROM public.pengumuman 
ORDER BY prioritas DESC, created_at DESC;
