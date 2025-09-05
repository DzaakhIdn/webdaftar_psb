# 📢 Sistem Pengumuman - Dokumentasi Lengkap

## 🎯 Overview

Sistem pengumuman adalah fitur untuk menampilkan dan mengelola pengumuman yang dapat dilihat oleh berbagai target audience (calon siswa, admin, panitia, atau semua).

## 🗄️ Database Schema

### Tabel `pengumuman`

```sql
CREATE TABLE pengumuman (
  id_pengumuman UUID PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  tipe VARCHAR(50) CHECK (tipe IN ('info', 'penting', 'urgent', 'sukses', 'peringatan')),
  status VARCHAR(20) CHECK (status IN ('aktif', 'nonaktif', 'draft')),
  tanggal_mulai TIMESTAMP WITH TIME ZONE,
  tanggal_berakhir TIMESTAMP WITH TIME ZONE,
  target_audience VARCHAR(50) CHECK (target_audience IN ('semua', 'calon_siswa', 'admin', 'panitia')),
  prioritas INTEGER CHECK (prioritas BETWEEN 1 AND 5),
  dibuat_oleh UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## 🎨 Components

### 1. PengumumanCard
**File:** `src/components/pengumuman/pengumuman-card.tsx`

Menampilkan satu pengumuman dalam bentuk card dengan:
- Icon berdasarkan tipe
- Judul dan konten
- Chip untuk tipe dan prioritas
- Expand/collapse untuk konten panjang
- Informasi tanggal

**Props:**
```typescript
interface PengumumanCardProps {
  pengumuman: Pengumuman;
  showFullContent?: boolean;
  elevation?: number;
}
```

### 2. PengumumanList
**File:** `src/components/pengumuman/pengumuman-list.tsx`

Menampilkan daftar pengumuman dengan:
- Filter berdasarkan tipe
- Search functionality
- Loading states
- Empty states

**Props:**
```typescript
interface PengumumanListProps {
  targetAudience?: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  showFilters?: boolean;
  maxItems?: number;
  title?: string;
  showFullContent?: boolean;
}
```

### 3. PengumumanWidget
**File:** `src/components/pengumuman/pengumuman-widget.tsx`

Widget kompak untuk dashboard dengan:
- Tampilan ringkas
- Tombol "Lihat Semua"
- Expand/collapse per item
- Loading dan error states

**Props:**
```typescript
interface PengumumanWidgetProps {
  targetAudience?: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}
```

## 🔧 Services & Models

### PengumumanService
**File:** `src/models/pengumuman-service.ts`

**Functions:**
- `getActivePengumuman(targetAudience?)` - Get active announcements
- `getAllPengumuman()` - Get all announcements (admin)
- `createPengumuman(data)` - Create new announcement
- `updatePengumuman(id, data)` - Update announcement
- `deletePengumuman(id)` - Delete announcement
- `getPengumumanTypeConfig(tipe)` - Get type styling config
- `formatTanggalPengumuman(tanggal)` - Format date for display

## 🎭 Tipe Pengumuman

| Tipe | Color | Icon | Deskripsi |
|------|-------|------|-----------|
| **info** | Blue | `eva:info-fill` | Informasi umum |
| **penting** | Orange | `eva:alert-triangle-fill` | Informasi penting |
| **urgent** | Red | `eva:alert-circle-fill` | Sangat penting/mendesak |
| **sukses** | Green | `eva:checkmark-circle-2-fill` | Berita baik/sukses |
| **peringatan** | Orange | `eva:alert-triangle-outline` | Peringatan |

## 🎯 Target Audience

- **semua** - Semua pengguna
- **calon_siswa** - Khusus calon siswa
- **admin** - Khusus admin
- **panitia** - Khusus panitia

## 📊 Prioritas

- **1-2** - Prioritas rendah (default color)
- **3** - Prioritas sedang (warning color)
- **4-5** - Prioritas tinggi (error color)

## 🚀 Setup & Installation

### 1. Database Setup
```bash
# Jalankan SQL script untuk membuat tabel
psql -f database/create-pengumuman-table.sql

# Atau jalankan setup script
npx tsx scripts/setup-pengumuman.ts
```

### 2. Import Components
```typescript
import { 
  PengumumanCard, 
  PengumumanList, 
  PengumumanWidget 
} from '@/components/pengumuman';
```

## 📝 Usage Examples

### Dashboard Widget
```typescript
<PengumumanWidget
  targetAudience="calon_siswa"
  maxItems={3}
  showViewAll={true}
  onViewAll={() => router.push('/pengumuman')}
/>
```

### Full Page List
```typescript
<PengumumanList
  targetAudience="semua"
  showFilters={true}
  title="Semua Pengumuman"
/>
```

### Admin Management
```typescript
import { PengumumanAdminView } from '@/sections/dashboard/pengumuman/views';

<PengumumanAdminView />
```

## 🔐 Permissions & Security

### Row Level Security (RLS)
- **Users** dapat membaca pengumuman aktif yang sesuai target audience
- **Admin/Panitia** dapat mengelola semua pengumuman
- **Service role** memiliki akses penuh

### Policies
```sql
-- Users can read active announcements
CREATE POLICY "Users can read active pengumuman" ON pengumuman
  FOR SELECT USING (
    status = 'aktif' 
    AND (tanggal_berakhir IS NULL OR tanggal_berakhir > NOW())
    AND tanggal_mulai <= NOW()
  );

-- Admin can manage all announcements
CREATE POLICY "Admin can manage all pengumuman" ON pengumuman
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'panitia')
    )
  );
```

## 🎨 Styling & Theming

### Type Colors
```typescript
const typeConfig = {
  info: { color: 'info', bgColor: 'rgba(0, 184, 217, 0.08)' },
  penting: { color: 'warning', bgColor: 'rgba(255, 171, 0, 0.08)' },
  urgent: { color: 'error', bgColor: 'rgba(255, 86, 48, 0.08)' },
  sukses: { color: 'success', bgColor: 'rgba(34, 197, 94, 0.08)' },
  peringatan: { color: 'warning', bgColor: 'rgba(255, 171, 0, 0.08)' }
};
```

### Custom Styling
```typescript
// Custom card elevation
<PengumumanCard pengumuman={data} elevation={3} />

// Full content display
<PengumumanCard pengumuman={data} showFullContent={true} />
```

## 🔄 State Management

### Loading States
- Skeleton loading untuk card dan list
- Loading indicators untuk form submission

### Error Handling
- Graceful error display dengan Alert components
- Console logging untuk debugging
- User-friendly error messages

### Empty States
- Informative empty state dengan icon dan message
- Different messages untuk filtered vs no data

## 📱 Responsive Design

- **Mobile First** approach
- **Collapsible content** untuk mobile
- **Responsive grid** untuk dashboard widgets
- **Touch-friendly** buttons dan interactions

## 🧪 Testing

### Component Testing
```typescript
// Test pengumuman card rendering
test('renders pengumuman card with correct data', () => {
  const mockPengumuman = {
    id_pengumuman: '1',
    judul: 'Test Announcement',
    konten: 'Test content',
    tipe: 'info',
    // ... other props
  };
  
  render(<PengumumanCard pengumuman={mockPengumuman} />);
  expect(screen.getByText('Test Announcement')).toBeInTheDocument();
});
```

## 🚀 Performance Optimization

- **Lazy loading** untuk large lists
- **Memoization** untuk expensive calculations
- **Pagination** untuk admin management
- **Efficient queries** dengan proper indexing

## 🔮 Future Enhancements

- [ ] Push notifications untuk pengumuman urgent
- [ ] Rich text editor untuk konten
- [ ] File attachments
- [ ] Email notifications
- [ ] Pengumuman scheduling
- [ ] Analytics dan read tracking
- [ ] Multi-language support
