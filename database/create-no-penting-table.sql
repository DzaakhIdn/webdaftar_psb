-- Create no_penting table for storing important phone numbers
CREATE TABLE IF NOT EXISTS public.no_penting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_nomor VARCHAR(100) NOT NULL,
  nomor_hp VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_no_penting_nama_nomor ON public.no_penting(nama_nomor);
CREATE INDEX IF NOT EXISTS idx_no_penting_nomor_hp ON public.no_penting(nomor_hp);

-- Enable Row Level Security (RLS)
ALTER TABLE public.no_penting ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can manage all no_penting" ON public.no_penting
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (read only)
CREATE POLICY "Authenticated users can read no_penting" ON public.no_penting
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_no_penting_updated_at 
  BEFORE UPDATE ON public.no_penting 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.no_penting (nama_nomor, nomor_hp) 
VALUES 
  ('Admin Sekolah', '08123456789'),
  ('Kepala Sekolah', '08234567890'),
  ('Bagian Keuangan', '08345678901'),
  ('Customer Service', '08456789012'),
  ('Emergency Contact', '08567890123')
ON CONFLICT DO NOTHING;

-- Verify the table and data
SELECT nama_nomor, nomor_hp, created_at 
FROM public.no_penting 
ORDER BY created_at DESC;
