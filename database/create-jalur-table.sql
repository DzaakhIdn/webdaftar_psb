-- Create jalur table for track/path management
CREATE TABLE IF NOT EXISTS public.jalur (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trackCode VARCHAR(50) UNIQUE NOT NULL,
  trackName VARCHAR(100) NOT NULL,
  quota INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster trackCode lookups
CREATE INDEX IF NOT EXISTS idx_jalur_trackcode ON public.jalur(trackCode);

-- Create index for status-based queries
CREATE INDEX IF NOT EXISTS idx_jalur_status ON public.jalur(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jalur ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can manage all jalur" ON public.jalur
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (can read all jalur data)
CREATE POLICY "Users can read all jalur data" ON public.jalur
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_jalur_updated_at 
  BEFORE UPDATE ON public.jalur 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample jalur data
INSERT INTO public.jalur (trackCode, trackName, quota, status) 
VALUES 
  ('BEASISAKH', 'BEASISWA AKHWAT', 5, 'aktif'),
  ('BEASISIKH', 'BEASISWA IKHWAN', 10, 'aktif'),
  ('REGAKH', 'REGULER AKHWAT', 15, 'aktif'),
  ('REGASIKH', 'REGULER IKHWAN', 40, 'aktif')
ON CONFLICT (trackCode) DO NOTHING;
