'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Box, 
  Stack,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Skeleton,
  Button
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from '@/components/iconify';
import { 
  Pengumuman, 
  getActivePengumuman, 
  getPengumumanTypeConfig, 
  formatTanggalPengumuman 
} from '@/models/pengumuman-service';

// ----------------------------------------------------------------------

interface PengumumanWidgetProps {
  targetAudience?: 'semua' | 'calon_siswa' | 'admin' | 'panitia';
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function PengumumanWidget({ 
  targetAudience = 'semua',
  maxItems = 3,
  showViewAll = true,
  onViewAll
}: PengumumanWidgetProps) {
  const theme = useTheme();
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Load pengumuman data
  useEffect(() => {
    const loadPengumuman = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getActivePengumuman(targetAudience);
        setPengumumanList(data.slice(0, maxItems));
      } catch (err) {
        console.error('Error loading pengumuman:', err);
        setError('Gagal memuat pengumuman');
      } finally {
        setLoading(false);
      }
    };

    loadPengumuman();
  }, [targetAudience, maxItems]);

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderPengumumanItem = (pengumuman: Pengumuman) => {
    const typeConfig = getPengumumanTypeConfig(pengumuman.tipe);
    const isExpanded = expandedItems.has(pengumuman.id_pengumuman);
    const isExpired = pengumuman.tanggal_berakhir && 
      new Date(pengumuman.tanggal_berakhir) < new Date();

    return (
      <Box
        key={pengumuman.id_pengumuman}
        sx={{
          p: 2,
          border: `1px solid ${alpha(typeConfig.textColor, 0.2)}`,
          borderLeft: `4px solid ${typeConfig.textColor}`,
          borderRadius: 1,
          mb: 2,
          opacity: isExpired ? 0.7 : 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[4],
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: typeConfig.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.5
            }}
          >
            <Iconify 
              icon={typeConfig.icon} 
              sx={{ 
                color: typeConfig.textColor,
                width: 16,
                height: 16 
              }} 
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {pengumuman.judul}
              </Typography>
              {pengumuman.prioritas >= 3 && (
                <Chip
                  label={`P${pengumuman.prioritas}`}
                  size="small"
                  color={pengumuman.prioritas >= 4 ? 'error' : 'warning'}
                  variant="filled"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: isExpanded ? 'none' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                whiteSpace: isExpanded ? 'pre-line' : 'normal'
              }}
            >
              {pengumuman.konten}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={pengumuman.tipe}
                  size="small"
                  color={typeConfig.color}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                <Typography variant="caption" color="text.disabled">
                  {formatTanggalPengumuman(pengumuman.created_at)}
                </Typography>
              </Box>

              {pengumuman.konten.length > 100 && (
                <IconButton
                  size="small"
                  onClick={() => handleToggleExpand(pengumuman.id_pengumuman)}
                  sx={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: theme.transitions.create('transform', {
                      duration: theme.transitions.duration.shortest,
                    }),
                  }}
                >
                  <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Stack spacing={2}>
          {[...Array(2)].map((_, index) => (
            <Box key={index} sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          ))}
        </Stack>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }

    if (pengumumanList.length === 0) {
      return (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
          }}
        >
          <Iconify 
            icon="eva:file-text-outline" 
            sx={{ 
              width: 48, 
              height: 48, 
              color: 'text.disabled',
              mb: 1 
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            Tidak ada pengumuman
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        {pengumumanList.map(renderPengumumanItem)}
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Pengumuman"
        subheader={`${pengumumanList.length} pengumuman aktif`}
        action={
          showViewAll && onViewAll && pengumumanList.length > 0 && (
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              onClick={onViewAll}
            >
              Lihat Semua
            </Button>
          )
        }
        sx={{
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <CardContent sx={{ p: 0 }}>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
