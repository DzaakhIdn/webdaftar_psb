-- Add avatar_url column to calonsiswa table
-- This migration adds support for storing avatar/profile picture URLs

-- Check if column exists first
DO $$
BEGIN
    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'calonsiswa' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.calonsiswa 
        ADD COLUMN avatar_url TEXT;
        
        RAISE NOTICE 'avatar_url column added to calonsiswa table';
    ELSE
        RAISE NOTICE 'avatar_url column already exists in calonsiswa table';
    END IF;
END $$;

-- Create index for faster avatar URL lookups (optional)
CREATE INDEX IF NOT EXISTS idx_calonsiswa_avatar_url 
ON public.calonsiswa(avatar_url) 
WHERE avatar_url IS NOT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'calonsiswa' 
AND column_name = 'avatar_url';
