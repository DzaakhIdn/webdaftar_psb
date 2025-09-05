'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Skeleton, 
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';

import { Iconify } from '@/components/iconify';
import { PengumumanCard } from './pengumuman-card';
import { 
  Pengumuman, 
  getActivePengumuman 
} from '@/models/pengumuman-service';

// ----------------------------------------------------------------------

interface PengumumanListProps {
  targetAudience?: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  showFilters?: boolean;
  maxItems?: number;
  title?: string;
  showFullContent?: boolean;
}

export function PengumumanList({ 
  targetAudience = 'semua',
  showFilters = true,
  maxItems,
  title = 'Pengumuman',
  showFullContent = false
}: PengumumanListProps) {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [filteredList, setFilteredList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterTipe, setFilterTipe] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Load pengumuman data
  useEffect(() => {
    const loadPengumuman = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getActivePengumuman(targetAudience);
        setPengumumanList(data);
        setFilteredList(data);
      } catch (err) {
        console.error('Error loading pengumuman:', err);
        setError('Gagal memuat pengumuman');
      } finally {
        setLoading(false);
      }
    };

    loadPengumuman();
  }, [targetAudience]);

  // Apply filters
  useEffect(() => {
    let filtered = [...pengumumanList];

    // Filter by type
    if (filterTipe !== 'semua') {
      filtered = filtered.filter(item => item.tipe === filterTipe);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.judul.toLowerCase().includes(query) ||
        item.konten.toLowerCase().includes(query)
      );
    }

    // Limit items if specified
    if (maxItems && maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredList(filtered);
  }, [pengumumanList, filterTipe, searchQuery, maxItems]);

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="Cari pengumuman..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Tipe</InputLabel>
          <Select
            value={filterTipe}
            label="Tipe"
            onChange={(e) => setFilterTipe(e.target.value)}
          >
            <MenuItem value="semua">Semua</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="penting">Penting</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="sukses">Sukses</MenuItem>
            <MenuItem value="peringatan">Peringatan</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Box key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Stack>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    if (filteredList.length === 0) {
      return (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
          }}
        >
          <Iconify 
            icon="eva:file-text-outline" 
            sx={{ 
              width: 64, 
              height: 64, 
              color: 'text.disabled',
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tidak ada pengumuman
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {searchQuery || filterTipe !== 'semua' 
              ? 'Tidak ada pengumuman yang sesuai dengan filter'
              : 'Belum ada pengumuman yang tersedia'
            }
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={0}>
        {filteredList.map((pengumuman) => (
          <PengumumanCard
            key={pengumuman.id_pengumuman}
            pengumuman={pengumuman}
            showFullContent={showFullContent}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        
        {pengumumanList.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${filteredList.length} pengumuman`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {targetAudience !== 'semua' && (
              <Chip
                label={`Target: ${targetAudience}`}
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      {/* Filters */}
      {renderFilters()}

      {/* Content */}
      {renderContent()}
    </Box>
  );
}
