-- Create text_template table for WhatsApp message templates
CREATE TABLE IF NOT EXISTS public.text_template (
  id_text UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_name VARCHAR(100) UNIQUE NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster text_name lookups
CREATE INDEX IF NOT EXISTS idx_text_template_text_name ON public.text_template(text_name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.text_template ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can manage all text_template" ON public.text_template
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (can read all templates)
CREATE POLICY "Users can read all text_template data" ON public.text_template
  FOR SELECT USING (true);

-- Create policy for authenticated users (can insert/update/delete)
CREATE POLICY "Users can manage text_template data" ON public.text_template
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_text_template_updated_at 
  BEFORE UPDATE ON public.text_template 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample template data for different status
INSERT INTO public.text_template (text_name, template) 
VALUES 
  (
    'pending', 
    'Halo {nama_siswa},

Terima kasih telah mendaftar di sekolah kami dengan nomor pendaftaran {no_daftar}.

Status pendaftaran Anda saat ini: {status}
Jalur pendaftaran: {jalur}

Mohon tunggu informasi selanjutnya dari kami.

Terima kasih.'
  ),
  (
    'diterima', 
    'Selamat {nama_siswa}! 🎉

Kami dengan senang hati memberitahukan bahwa Anda telah DITERIMA di sekolah kami.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Password untuk login sistem: {password_hash}

Silakan simpan password ini dengan baik dan segera login ke sistem untuk melengkapi data Anda.

Selamat bergabung dengan keluarga besar sekolah kami!

Terima kasih.'
  ),
  (
    'ditolak', 
    'Halo {nama_siswa},

Terima kasih atas minat Anda untuk bergabung dengan sekolah kami.

Setelah melalui proses seleksi yang ketat, kami mohon maaf harus memberitahukan bahwa pendaftaran Anda dengan nomor {no_daftar} belum dapat kami terima pada periode ini.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Jangan berkecil hati, Anda dapat mencoba mendaftar kembali pada periode pendaftaran berikutnya.

Terima kasih atas pengertiannya.'
  ),
  (
    'sedang tes', 
    'Halo {nama_siswa},

Selamat! Anda telah lolos tahap administrasi dan akan mengikuti tahap selanjutnya.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Mohon persiapkan diri Anda dengan baik untuk tahap selanjutnya. Informasi lebih lanjut akan kami sampaikan segera.

Semoga sukses!

Terima kasih.'
  )
ON CONFLICT (text_name) DO UPDATE SET
  template = EXCLUDED.template,
  updated_at = NOW();

-- Verify the table and data
SELECT text_name, LEFT(template, 50) || '...' as template_preview 
FROM public.text_template 
ORDER BY text_name;
