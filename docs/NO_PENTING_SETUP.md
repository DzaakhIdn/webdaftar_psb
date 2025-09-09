# Setup Tabel No Penting

## Masalah
Data `no_penting` tidak ter-load karena tabel `no_penting` belum dibuat di database.

## Solusi

### 1. Buat Tabel di Database

**Option A: Via Supabase SQL Editor**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Masuk ke SQL Editor
4. Copy dan paste isi file `database/create-no-penting-table.sql`
5. Jalankan query

**Option B: Via Script**
```bash
# Jalankan script setup
npx tsx scripts/setup-no-penting-table.ts
```

### 2. Struktur Tabel

```sql
CREATE TABLE public.no_penting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_nomor VARCHAR(100) NOT NULL,
  nomor_hp VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Data Sample

Tabel akan diisi dengan data sample:
- Admin Sekolah: 08123456789
- Kepala Sekolah: 08234567890
- Bagian Keuangan: 08345678901
- Customer Service: 08456789012
- Emergency Contact: 08567890123

### 4. Verifikasi

Setelah tabel dibuat, refresh halaman admin dan data nomor penting akan ter-load.

## Error Handling

Kode sudah diperbaiki untuk menangani berbagai error:
- Tabel tidak ada
- Tidak ada permission
- Data kosong
- Error lainnya

## Interface TypeScript

```typescript
interface NoHp {
  id: string;
  nama_nomor: string;
  nomor_hp: string;
  created_at?: string;
}
```

## Files yang Terlibat

- `database/create-no-penting-table.sql` - Script SQL untuk membuat tabel
- `scripts/setup-no-penting-table.ts` - Script TypeScript untuk setup
- `src/sections/dashboard/admin/views/user-admin-view.tsx` - Komponen yang menggunakan data
- `src/sections/dashboard/admin/no-hp-row.tsx` - Komponen row untuk menampilkan data
