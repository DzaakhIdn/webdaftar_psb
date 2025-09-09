-- Update no_penting table to support gender-based contacts
-- This migration adds gender and role columns to no_penting table

-- Add gender and role columns to no_penting table
DO $$
BEGIN
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'no_penting'
        AND column_name = 'gender'
    ) THEN
        ALTER TABLE public.no_penting
        ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('ikhwan', 'akhwat'));

        RAISE NOTICE 'gender column added to no_penting table';
    ELSE
        RAISE NOTICE 'gender column already exists in no_penting table';
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'no_penting'
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.no_penting
        ADD COLUMN role VARCHAR(20) CHECK (role IN ('admin', 'panitia', 'bendahara'));

        RAISE NOTICE 'role column added to no_penting table';
    ELSE
        RAISE NOTICE 'role column already exists in no_penting table';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_no_penting_gender ON public.no_penting(gender);
CREATE INDEX IF NOT EXISTS idx_no_penting_role ON public.no_penting(role);
CREATE INDEX IF NOT EXISTS idx_no_penting_role_gender ON public.no_penting(role, gender);

-- Insert sample data for gender-based contacts
INSERT INTO public.no_penting (nama_nomor, nomor_hp, gender, role)
VALUES
    -- Admin contacts
    ('Admin Ikhwan', '081234567890', 'ikhwan', 'admin'),
    ('Admin Akhwat', '081234567891', 'akhwat', 'admin'),

    -- Panitia contacts
    ('Panitia Ikhwan', '081234567892', 'ikhwan', 'panitia'),
    ('Panitia Akhwat', '081234567893', 'akhwat', 'panitia'),

    -- Bendahara contacts
    ('Bendahara Ikhwan', '081234567894', 'ikhwan', 'bendahara'),
    ('Bendahara Akhwat', '081234567895', 'akhwat', 'bendahara')
ON CONFLICT DO NOTHING;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'no_penting'
AND column_name IN ('nama_nomor', 'nomor_hp', 'gender', 'role')
ORDER BY column_name;

-- Show sample data
SELECT nama_nomor, nomor_hp, gender, role, created_at
FROM public.no_penting
ORDER BY role, gender;

RAISE NOTICE 'no_penting table updated successfully with gender-based contacts';