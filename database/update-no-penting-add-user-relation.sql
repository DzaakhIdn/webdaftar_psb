-- Update no_penting table to add user relation
-- This migration adds user_id column and creates foreign key relationship

-- Add user_id column to no_penting table
DO $$
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'no_penting'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.no_penting
        ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

        RAISE NOTICE 'user_id column added to no_penting table';
    ELSE
        RAISE NOTICE 'user_id column already exists in no_penting table';
    END IF;
END $$;

-- Create index for user_id foreign key
CREATE INDEX IF NOT EXISTS idx_no_penting_user_id ON public.no_penting(user_id);

-- Add description column for better context
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'no_penting'
        AND column_name = 'description'
    ) THEN
        ALTER TABLE public.no_penting
        ADD COLUMN description TEXT;

        RAISE NOTICE 'description column added to no_penting table';
    ELSE
        RAISE NOTICE 'description column already exists in no_penting table';
    END IF;
END $$;

-- Update existing data to link with users where possible
-- This is a one-time migration for existing data
UPDATE public.no_penting 
SET user_id = (
    SELECT u.id 
    FROM public.users u 
    WHERE u.nama_lengkap ILIKE '%' || no_penting.nama_nomor || '%'
    OR no_penting.nama_nomor ILIKE '%' || u.nama_lengkap || '%'
    LIMIT 1
)
WHERE user_id IS NULL;

-- Insert sample data with user relations
-- First, get some user IDs for the sample data
DO $$
DECLARE
    admin_id UUID;
    panitia_id UUID;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_id FROM public.users WHERE role = 'admin' LIMIT 1;
    
    -- Get panitia user ID  
    SELECT id INTO panitia_id FROM public.users WHERE role LIKE '%panitia%' LIMIT 1;
    
    -- Insert sample data with user relations if users exist
    IF admin_id IS NOT NULL THEN
        INSERT INTO public.no_penting (nama_nomor, nomor_hp, user_id, description) 
        VALUES 
            ('Admin Utama', '08111111111', admin_id, 'Kontak admin utama untuk urusan sistem dan teknis')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF panitia_id IS NOT NULL THEN
        INSERT INTO public.no_penting (nama_nomor, nomor_hp, user_id, description) 
        VALUES 
            ('Panitia Pendaftaran', '08222222222', panitia_id, 'Kontak panitia untuk urusan pendaftaran siswa')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Insert some generic contacts without user relation
    INSERT INTO public.no_penting (nama_nomor, nomor_hp, description) 
    VALUES 
        ('Emergency Hotline', '08999999999', 'Nomor darurat untuk situasi mendesak'),
        ('Customer Service', '08888888888', 'Layanan pelanggan untuk pertanyaan umum'),
        ('Technical Support', '08777777777', 'Dukungan teknis untuk masalah sistem')
    ON CONFLICT DO NOTHING;
END $$;

-- Create a view for easier querying with user information
CREATE OR REPLACE VIEW public.v_no_penting_with_user AS
SELECT 
    np.id,
    np.nama_nomor,
    np.nomor_hp,
    np.description,
    np.user_id,
    u.username,
    u.nama_lengkap as user_nama_lengkap,
    u.role as user_role,
    u.gender as user_gender,
    np.created_at,
    np.updated_at
FROM public.no_penting np
LEFT JOIN public.users u ON np.user_id = u.id
ORDER BY np.created_at DESC;

-- Grant permissions on the view
GRANT SELECT ON public.v_no_penting_with_user TO authenticated;
GRANT SELECT ON public.v_no_penting_with_user TO service_role;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'no_penting'
AND column_name IN ('user_id', 'description')
ORDER BY column_name;

-- Show sample data with user relations
SELECT 
    nama_nomor,
    nomor_hp,
    user_nama_lengkap,
    user_role,
    description,
    created_at
FROM public.v_no_penting_with_user
ORDER BY created_at DESC
LIMIT 10;

RAISE NOTICE 'no_penting table updated successfully with user relations';
