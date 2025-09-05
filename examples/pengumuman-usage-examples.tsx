// ============================================================================
// CONTOH PENGGUNAAN COMPONENT PENGUMUMAN
// ============================================================================

import { Grid, Container } from '@mui/material';
import { PengumumanWidget, PengumumanList } from '@/components/pengumuman';

// ============================================================================
// 1. PENGGUNAAN DI DASHBOARD UTAMA (Widget Kecil)
// ============================================================================

export function DashboardWithPengumuman() {
  const handleViewAllPengumuman = () => {
    // Navigate to pengumuman page
    window.location.href = '/dashboard/pengumuman';
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Other dashboard widgets */}
        <Grid item xs={12} md={6} lg={4}>
          {/* Widget pengumuman untuk calon siswa */}
          <PengumumanWidget
            targetAudience="calon_siswa"
            maxItems={3}
            showViewAll={true}
            onViewAll={handleViewAllPengumuman}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          {/* Widget pengumuman untuk admin */}
          <PengumumanWidget
            targetAudience="admin"
            maxItems={2}
            showViewAll={true}
            onViewAll={handleViewAllPengumuman}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ============================================================================
// 2. HALAMAN KHUSUS PENGUMUMAN (Full List)
// ============================================================================

export function PengumumanPage() {
  return (
    <Container maxWidth="lg">
      {/* List lengkap pengumuman dengan filter */}
      <PengumumanList
        targetAudience="semua"
        showFilters={true}
        title="Semua Pengumuman"
      />
    </Container>
  );
}

// ============================================================================
// 3. PENGUMUMAN UNTUK CALON SISWA
// ============================================================================

export function CalonSiswaDashboard() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Pengumuman khusus calon siswa */}
          <PengumumanList
            targetAudience="calon_siswa"
            showFilters={false}
            maxItems={5}
            title="Pengumuman untuk Calon Siswa"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ============================================================================
// 4. ADMIN DASHBOARD DENGAN WIDGET PENGUMUMAN
// ============================================================================

export function AdminDashboard() {
  const handleManagePengumuman = () => {
    // Navigate to admin pengumuman management
    window.location.href = '/dashboard/admin/pengumuman';
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Admin stats widgets */}
        
        <Grid item xs={12} lg={8}>
          {/* Other admin content */}
        </Grid>

        <Grid item xs={12} lg={4}>
          {/* Widget pengumuman dengan tombol manage */}
          <PengumumanWidget
            targetAudience="admin"
            maxItems={3}
            showViewAll={true}
            onViewAll={handleManagePengumuman}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ============================================================================
// 5. PENGGUNAAN DENGAN CUSTOM STYLING
// ============================================================================

export function CustomPengumumanWidget() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Widget dengan styling custom */}
      <PengumumanWidget
        targetAudience="semua"
        maxItems={2}
        showViewAll={false}
      />
    </div>
  );
}

// ============================================================================
// ROUTING EXAMPLES (untuk Next.js App Router)
// ============================================================================

/*
// app/dashboard/pengumuman/page.tsx
import { PengumumanView } from '@/sections/dashboard/pengumuman/views';

export default function PengumumanPage() {
  return <PengumumanView targetAudience="semua" />;
}

// app/dashboard/admin/pengumuman/page.tsx
import { PengumumanAdminView } from '@/sections/dashboard/pengumuman/views';

export default function AdminPengumumanPage() {
  return <PengumumanAdminView />;
}
*/

// ============================================================================
// API USAGE EXAMPLES
// ============================================================================

/*
import { 
  getActivePengumuman, 
  createPengumuman, 
  updatePengumuman, 
  deletePengumuman 
} from '@/models/pengumuman-service';

// Get pengumuman for specific audience
const pengumumanList = await getActivePengumuman('calon_siswa');

// Create new pengumuman
const result = await createPengumuman({
  judul: 'Pengumuman Baru',
  konten: 'Isi pengumuman...',
  tipe: 'info',
  status: 'aktif',
  target_audience: 'semua',
  prioritas: 1,
  tanggal_mulai: new Date().toISOString(),
  tanggal_berakhir: null
});

// Update pengumuman
const updateResult = await updatePengumuman('pengumuman-id', {
  judul: 'Judul Baru',
  status: 'nonaktif'
});

// Delete pengumuman
const deleteResult = await deletePengumuman('pengumuman-id');
*/
