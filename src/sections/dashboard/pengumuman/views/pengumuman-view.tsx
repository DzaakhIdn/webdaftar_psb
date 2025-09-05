'use client';

import { Container, Typography } from '@mui/material';

import { DashboardContent } from '@/layout/dashboard';
import { PengumumanList } from '@/components/pengumuman';

// ----------------------------------------------------------------------

interface PengumumanViewProps {
  targetAudience?: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
}

export function PengumumanView({ 
  targetAudience = 'semua' 
}: PengumumanViewProps) {
  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Pengumuman
        </Typography>

        <PengumumanList 
          targetAudience={targetAudience}
          showFilters={true}
          title=""
        />
      </Container>
    </DashboardContent>
  );
}
