-- Fix existing pengumuman records where dibuat_oleh is NULL
-- This script updates existing records and sets default value for future records

-- Update existing records where dibuat_oleh is NULL
UPDATE public.pengumuman 
SET dibuat_oleh = 'admin' 
WHERE dibuat_oleh IS NULL;

-- Alter table to set default value for future records (if not already set)
ALTER TABLE public.pengumuman 
ALTER COLUMN dibuat_oleh SET DEFAULT 'admin';

-- Verify the changes
SELECT 
  id_pengumuman,
  judul,
  dibuat_oleh,
  created_at
FROM public.pengumuman 
ORDER BY created_at DESC;

-- Show count of records by dibuat_oleh
SELECT 
  dibuat_oleh,
  COUNT(*) as jumlah_pengumuman
FROM public.pengumuman 
GROUP BY dibuat_oleh;
