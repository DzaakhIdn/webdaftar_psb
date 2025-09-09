-- Update users table to support gender-based roles
-- This migration adds gender column and updates role constraints

-- Add gender column to users table
DO $$
BEGIN
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'gender'
    ) THEN
        ALTER TABLE public.users
        ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('ikhwan', 'akhwat'));

        RAISE NOTICE 'gender column added to users table';
    ELSE
        RAISE NOTICE 'gender column already exists in users table';
    END IF;
END $$;

-- Drop existing role constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new role constraint with gender-based roles
ALTER TABLE public.users
ADD CONSTRAINT users_role_check
CHECK (role IN (
    'admin', 'admin_ikhwan', 'admin_akhwat',
    'panitia', 'panitia_ikhwan', 'panitia_akhwat',
    'bendahara', 'bendahara_ikhwan', 'bendahara_akhwat',
    'user'
));

-- Create index for gender-based queries
CREATE INDEX IF NOT EXISTS idx_users_gender ON public.users(gender);
CREATE INDEX IF NOT EXISTS idx_users_role_gender ON public.users(role, gender);

-- Update existing users to have gender based on their current role
-- This is a one-time migration for existing data
UPDATE public.users
SET gender = CASE
    WHEN role LIKE '%_ikhwan' THEN 'ikhwan'
    WHEN role LIKE '%_akhwat' THEN 'akhwat'
    ELSE NULL -- Keep NULL for generic roles like 'admin', 'panitia', 'bendahara'
END
WHERE gender IS NULL;

-- Insert sample users with gender-based roles
INSERT INTO public.users (username, password_hash, nama_lengkap, role, gender)
VALUES
    ('admin_ikhwan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Ikhwan', 'admin_ikhwan', 'ikhwan'),
    ('admin_akhwat', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Akhwat', 'admin_akhwat', 'akhwat'),
    ('panitia_ikhwan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Panitia Ikhwan', 'panitia_ikhwan', 'ikhwan'),
    ('panitia_akhwat', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Panitia Akhwat', 'panitia_akhwat', 'akhwat'),
    ('bendahara_ikhwan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bendahara Ikhwan', 'bendahara_ikhwan', 'ikhwan'),
    ('bendahara_akhwat', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bendahara Akhwat', 'bendahara_akhwat', 'akhwat')
ON CONFLICT (username) DO NOTHING;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('role', 'gender')
ORDER BY column_name;

-- Show sample data
SELECT username, nama_lengkap, role, gender, created_at
FROM public.users
ORDER BY role, gender;

RAISE NOTICE 'Users table updated successfully with gender-based roles';