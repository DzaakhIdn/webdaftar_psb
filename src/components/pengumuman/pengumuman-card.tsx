'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Chip, Typography, Box, Collapse, IconButton, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from '@/components/iconify';
import { 
  Pengumuman, 
  getPengumumanTypeConfig, 
  formatTanggalPengumuman 
} from '@/models/pengumuman-service';

// ----------------------------------------------------------------------

interface PengumumanCardProps {
  pengumuman: Pengumuman;
  showFullContent?: boolean;
  elevation?: number;
}

export function PengumumanCard({ 
  pengumuman, 
  showFullContent = false,
  elevation = 1 
}: PengumumanCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(showFullContent);
  
  const typeConfig = getPengumumanTypeConfig(pengumuman.tipe);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isExpired = pengumuman.tanggal_berakhir && 
    new Date(pengumuman.tanggal_berakhir) < new Date();

  const priorityColor = pengumuman.prioritas >= 4 ? 'error' : 
                       pengumuman.prioritas >= 3 ? 'warning' : 'default';

  return (
    <Card
      elevation={elevation}
      sx={{
        mb: 2,
        border: `1px solid ${alpha(typeConfig.textColor, 0.2)}`,
        borderLeft: `4px solid ${typeConfig.textColor}`,
        opacity: isExpired ? 0.7 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: elevation + 1,
          transform: 'translateY(-1px)',
        }
      }}
    >
      <CardHeader
        avatar={
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: typeConfig.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify 
              icon={typeConfig.icon} 
              sx={{ 
                color: typeConfig.textColor,
                width: 20,
                height: 20 
              }} 
            />
          </Box>
        }
        title={
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {pengumuman.judul}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip
              label={pengumuman.tipe.toUpperCase()}
              size="small"
              color={typeConfig.color}
              variant="outlined"
            />
            {pengumuman.prioritas >= 3 && (
              <Chip
                label={`Prioritas ${pengumuman.prioritas}`}
                size="small"
                color={priorityColor}
                variant="filled"
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {formatTanggalPengumuman(pengumuman.created_at)}
            </Typography>
          </Box>
        }
        action={
          !showFullContent && (
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
              }}
            >
              <Iconify icon="eva:arrow-ios-downward-fill" />
            </IconButton>
          )
        }
      />

      <CardContent sx={{ pt: 0 }}>
        {!showFullContent && !expanded ? (
          <Typography variant="body2" color="text.secondary">
            {pengumuman.konten.length > 150 
              ? `${pengumuman.konten.substring(0, 150)}...` 
              : pengumuman.konten
            }
          </Typography>
        ) : (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'pre-line',
              lineHeight: 1.6 
            }}
          >
            {pengumuman.konten}
          </Typography>
        )}

        {!showFullContent && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Target: ${pengumuman.target_audience}`}
                size="small"
                variant="outlined"
                color="default"
              />
              {pengumuman.tanggal_berakhir && (
                <Chip
                  label={`Berakhir: ${formatTanggalPengumuman(pengumuman.tanggal_berakhir)}`}
                  size="small"
                  variant="outlined"
                  color={isExpired ? "error" : "default"}
                />
              )}
            </Box>
          </Collapse>
        )}

        {showFullContent && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Target: ${pengumuman.target_audience}`}
                size="small"
                variant="outlined"
                color="default"
              />
              <Chip
                label={`Status: ${pengumuman.status}`}
                size="small"
                variant="outlined"
                color={pengumuman.status === 'aktif' ? 'success' : 'default'}
              />
              {pengumuman.tanggal_berakhir && (
                <Chip
                  label={`Berakhir: ${formatTanggalPengumuman(pengumuman.tanggal_berakhir)}`}
                  size="small"
                  variant="outlined"
                  color={isExpired ? "error" : "default"}
                />
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
