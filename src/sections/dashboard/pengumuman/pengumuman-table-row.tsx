'use client';

import { 
  TableRow, 
  TableCell, 
  IconButton, 
  MenuItem, 
  MenuList,
  Typography,
  Chip,
  Box
} from '@mui/material';

import { usePopover } from 'minimal-shared/hooks';
import { Iconify } from '@/components/iconify';
import { CustomPopover } from '@/components/custom-popover';

import { 
  Pengumuman, 
  getPengumumanTypeConfig, 
  formatTanggalPengumuman 
} from '@/models/pengumuman-service';

// ----------------------------------------------------------------------

interface PengumumanTableRowProps {
  row: Pengumuman;
  onEditRow: () => void;
  onDeleteRow: () => void;
}

export function PengumumanTableRow({ 
  row, 
  onEditRow, 
  onDeleteRow 
}: PengumumanTableRowProps) {
  const popover = usePopover();
  
  const typeConfig = getPengumumanTypeConfig(row.tipe);
  
  const isExpired = row.tanggal_berakhir && 
    new Date(row.tanggal_berakhir) < new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'success';
      case 'nonaktif':
        return 'default';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (prioritas: number) => {
    if (prioritas >= 4) return 'error';
    if (prioritas >= 3) return 'warning';
    return 'default';
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {row.judul}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              noWrap
              sx={{ maxWidth: 200 }}
            >
              {row.konten.length > 50 
                ? `${row.konten.substring(0, 50)}...` 
                : row.konten
              }
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Chip
            label={row.tipe.toUpperCase()}
            size="small"
            color={typeConfig.color}
            variant="outlined"
            icon={<Iconify icon={typeConfig.icon} />}
          />
        </TableCell>

        <TableCell>
          <Chip
            label={row.status.toUpperCase()}
            size="small"
            color={getStatusColor(row.status)}
            variant="filled"
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2">
            {row.target_audience === 'semua' ? 'Semua' : 
             row.target_audience === 'calon_siswa' ? 'Calon Siswa' :
             row.target_audience === 'admin' ? 'Admin' : 'Panitia'}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={row.prioritas}
            size="small"
            color={getPriorityColor(row.prioritas)}
            variant="outlined"
          />
        </TableCell>

        <TableCell>
          {row.tanggal_berakhir ? (
            <Box>
              <Typography 
                variant="body2" 
                color={isExpired ? 'error.main' : 'text.primary'}
              >
                {formatTanggalPengumuman(row.tanggal_berakhir)}
              </Typography>
              {isExpired && (
                <Chip
                  label="Expired"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tidak terbatas
            </Typography>
          )}
        </TableCell>

        <TableCell align="right">
          <IconButton 
            color={popover.open ? 'inherit' : 'default'} 
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDeleteRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Hapus
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
