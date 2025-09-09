-- Fix permissions for no_penting table
-- This script ensures proper access to the no_penting table

-- First, check if table exists
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'no_penting';

-- Check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'no_penting';

-- Disable RLS temporarily for testing (ONLY for development)
-- WARNING: This makes the table publicly accessible
ALTER TABLE public.no_penting DISABLE ROW LEVEL SECURITY;

-- Alternative: Create more permissive policies
-- Uncomment these if you want to keep RLS enabled but allow broader access

-- Drop existing policies
-- DROP POLICY IF EXISTS "Service role can manage all no_penting" ON public.no_penting;
-- DROP POLICY IF EXISTS "Authenticated users can read no_penting" ON public.no_penting;

-- Create new policies that allow public read access
-- CREATE POLICY "Public can read no_penting" ON public.no_penting
--   FOR SELECT USING (true);

-- Create policy for authenticated users to manage data
-- CREATE POLICY "Authenticated users can manage no_penting" ON public.no_penting
--   FOR ALL USING (auth.role() = 'authenticated');

-- Insert some test data if table is empty
INSERT INTO public.no_penting (nama_nomor, nomor_hp) 
VALUES 
  ('Test Admin', '08123456789'),
  ('Test Support', '08234567890')
ON CONFLICT DO NOTHING;

-- Verify data exists
SELECT 
  id,
  nama_nomor, 
  nomor_hp, 
  created_at 
FROM public.no_penting 
ORDER BY created_at DESC;

-- Check table permissions
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'no_penting';

-- Show final status
SELECT 
  'Table exists: ' || CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'no_penting' AND table_schema = 'public'
  ) THEN 'YES' ELSE 'NO' END as table_status,
  
  'RLS enabled: ' || CASE WHEN (
    SELECT rowsecurity FROM pg_tables 
    WHERE tablename = 'no_penting' AND schemaname = 'public'
  ) THEN 'YES' ELSE 'NO' END as rls_status,
  
  'Data count: ' || COALESCE((
    SELECT COUNT(*)::text FROM public.no_penting
  ), '0') as data_count;
