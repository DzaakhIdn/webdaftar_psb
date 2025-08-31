-- Populate jalurFinal table with data based on existing jalur data
-- This creates jalur final options for each jalur based on gender

-- First, let's see what jalur data we have
-- SELECT * FROM public.jalur;

-- Insert jalur final data for each jalur and gender combination
-- Assuming we have jalur with trackCodes: BEASISAKH, BEASISIKH, REGAKH, REGASIKH

-- Get jalur IDs first (you might need to adjust these based on actual IDs)
DO $$
DECLARE
    beasiswa_akhwat_id UUID;
    beasiswa_ikhwan_id UUID;
    reguler_akhwat_id UUID;
    reguler_ikhwan_id UUID;
BEGIN
    -- Get jalur IDs
    SELECT id INTO beasiswa_akhwat_id FROM public.jalur WHERE trackCode = 'BEASISAKH';
    SELECT id INTO beasiswa_ikhwan_id FROM public.jalur WHERE trackCode = 'BEASISIKH';
    SELECT id INTO reguler_akhwat_id FROM public.jalur WHERE trackCode = 'REGAKH';
    SELECT id INTO reguler_ikhwan_id FROM public.jalur WHERE trackCode = 'REGASIKH';

    -- Insert jalurFinal data
    -- BEASISWA AKHWAT (for Perempuan)
    IF beasiswa_akhwat_id IS NOT NULL THEN
        INSERT INTO public.jalurFinal (id_jalur, nama_jalur_final, jenis_kelamin)
        VALUES (beasiswa_akhwat_id, 'Beasiswa Akhwat', 'perempuan')
        ON CONFLICT DO NOTHING;
    END IF;

    -- BEASISWA IKHWAN (for Laki-laki)
    IF beasiswa_ikhwan_id IS NOT NULL THEN
        INSERT INTO public.jalurFinal (id_jalur, nama_jalur_final, jenis_kelamin)
        VALUES (beasiswa_ikhwan_id, 'Beasiswa Ikhwan', 'laki-laki')
        ON CONFLICT DO NOTHING;
    END IF;

    -- REGULER AKHWAT (for Perempuan)
    IF reguler_akhwat_id IS NOT NULL THEN
        INSERT INTO public.jalurFinal (id_jalur, nama_jalur_final, jenis_kelamin)
        VALUES (reguler_akhwat_id, 'Reguler Akhwat', 'perempuan')
        ON CONFLICT DO NOTHING;
    END IF;

    -- REGULER IKHWAN (for Laki-laki)
    IF reguler_ikhwan_id IS NOT NULL THEN
        INSERT INTO public.jalurFinal (id_jalur, nama_jalur_final, jenis_kelamin)
        VALUES (reguler_ikhwan_id, 'Reguler Ikhwan', 'laki-laki')
        ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE 'JalurFinal data populated successfully';
END $$;

-- Verify the data
SELECT 
    jf.id_jalur_final,
    jf.nama_jalur_final,
    jf.jenis_kelamin,
    j.trackCode,
    j.trackName
FROM public.jalurFinal jf
JOIN public.jalur j ON jf.id_jalur = j.id
ORDER BY jf.jenis_kelamin, j.trackCode;
