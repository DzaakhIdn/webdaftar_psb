# 🚀 Quick Setup Pengumuman System

## ❌ Problem: Environment Variables Not Loading

Error yang Anda alami:
```
Error: supabaseUrl is required.
```

Ini terjadi karena script `npx tsx` tidak otomatis memuat file `.env.local`.

## ✅ Solutions

### **Option 1: Use Simple Script (Recommended)**

1. **Edit credentials** di `scripts/setup-pengumuman-simple.ts`:
```typescript
// Line 4-6: Replace with your actual credentials
const SUPABASE_URL = "https://sitriyahsmaitsiid.supabase.co";
const SUPABASE_ANON_KEY = "your-actual-anon-key-here";
```

2. **Run the simple script**:
```bash
npx tsx scripts/setup-pengumuman-simple.ts
```

### **Option 2: Manual Database Setup**

1. **Create table** using SQL script:
```sql
-- Copy content from database/create-pengumuman-table.sql
-- Run in Supabase SQL Editor
```

2. **Insert sample data** manually via Supabase dashboard

### **Option 3: Fix Environment Loading**

1. **Install dotenv** (if not already installed):
```bash
npm install dotenv
```

2. **Run with environment loading**:
```bash
node -r dotenv/config scripts/setup-pengumuman.js
```

## 🔧 Step-by-Step Setup

### **Step 1: Get Your Supabase Credentials**

From your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **Step 2: Create Database Table**

**Option A: Via Supabase SQL Editor**
```sql
-- Copy and paste from database/create-pengumuman-table.sql
CREATE TABLE IF NOT EXISTS public.pengumuman (
  id_pengumuman UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  tipe VARCHAR(50) DEFAULT 'info' CHECK (tipe IN ('info', 'penting', 'urgent', 'sukses', 'peringatan')),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif', 'draft')),
  tanggal_mulai TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tanggal_berakhir TIMESTAMP WITH TIME ZONE,
  target_audience VARCHAR(50) DEFAULT 'semua' CHECK (target_audience IN ('semua', 'calon_siswa', 'admin', 'panitia')),
  prioritas INTEGER DEFAULT 1 CHECK (prioritas BETWEEN 1 AND 5),
  dibuat_oleh VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Option B: Via Script**
```bash
# Edit credentials first in setup-pengumuman-simple.ts
npx tsx scripts/setup-pengumuman-simple.ts
```

### **Step 3: Verify Setup**

1. **Check Supabase Dashboard**:
   - Go to Table Editor
   - Look for `pengumuman` table
   - Should have sample data

2. **Test in Application**:
   - Open `/dashboard/admin` - should show pengumuman stats
   - Open registrant overview - should show pengumuman widget

## 🎯 Expected Results

After successful setup:

### **Database**
```
pengumuman table with columns:
├── id_pengumuman (UUID)
├── judul (VARCHAR)
├── konten (TEXT)
├── tipe (VARCHAR)
├── status (VARCHAR)
├── target_audience (VARCHAR)
├── prioritas (INTEGER)
└── sample data (3-5 records)
```

### **Application**
- ✅ Admin dashboard shows pengumuman stats
- ✅ Registrant overview shows pengumuman widget
- ✅ Admin can manage pengumuman at `/dashboard/admin/pengumuman`
- ✅ Pengumuman appear based on target audience

## 🐛 Troubleshooting

### **Error: Table doesn't exist**
```bash
❌ Table pengumuman does not exist
```
**Solution**: Create table first using SQL script

### **Error: Permission denied**
```bash
❌ permission denied for table pengumuman
```
**Solution**: Check RLS policies or use service role key

### **Error: Invalid credentials**
```bash
❌ Invalid API key
```
**Solution**: Check your `.env.local` file for correct credentials

### **No pengumuman showing**
```bash
✅ Setup completed but no data in app
```
**Solution**: 
1. Check target_audience matches user type
2. Check status is 'aktif'
3. Check tanggal_mulai/berakhir

## 🚀 Quick Test

After setup, test these URLs:
- **Admin Dashboard**: `http://localhost:3000/dashboard/admin`
- **Manage Pengumuman**: `http://localhost:3000/dashboard/admin/pengumuman`
- **Registrant Overview**: `http://localhost:3000/overview/registrant`

## 📝 Manual Data Insert (Fallback)

If scripts fail, insert manually via Supabase:

```sql
INSERT INTO pengumuman (judul, konten, tipe, status, target_audience, prioritas, dibuat_oleh) VALUES
('Welcome Message', 'Selamat datang di sistem pendaftaran', 'info', 'aktif', 'calon_siswa', 1, 'admin'),
('Important Notice', 'Pengumuman penting untuk semua', 'penting', 'aktif', 'semua', 3, 'admin'),
('Urgent Update', 'Update mendesak', 'urgent', 'aktif', 'calon_siswa', 5, 'admin');
```

## ✅ Success Indicators

You'll know it's working when:
- ✅ No console errors about missing table
- ✅ Admin dashboard shows pengumuman count > 0
- ✅ Registrant overview shows pengumuman widget with content
- ✅ Can create/edit pengumuman via admin interface

**Ready to go!** 🎉
