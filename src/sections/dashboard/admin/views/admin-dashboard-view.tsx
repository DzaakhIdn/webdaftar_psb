'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Stack,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { DashboardContent } from '@/layouts/dashboard';
import { Iconify } from '@/components/iconify';
import { PengumumanWidget } from '@/components/pengumuman';
import { showAllData } from '@/models';

// ----------------------------------------------------------------------

interface DashboardStats {
  totalUsers: number;
  totalRegistrants: number;
  totalPengumuman: number;
  activePengumuman: number;
}

export function AdminDashboardView() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRegistrants: 0,
    totalPengumuman: 0,
    activePengumuman: 0
  });
  const [loading, setLoading] = useState(true);

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Load various stats
        const [users, registrants, pengumuman] = await Promise.all([
          showAllData('users').catch(() => []),
          showAllData('calonsiswa').catch(() => []),
          showAllData('pengumuman').catch(() => [])
        ]);

        const activePengumuman = Array.isArray(pengumuman) 
          ? pengumuman.filter((p: any) => p.status === 'aktif').length 
          : 0;

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalRegistrants: Array.isArray(registrants) ? registrants.length : 0,
          totalPengumuman: Array.isArray(pengumuman) ? pengumuman.length : 0,
          activePengumuman
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleNavigateToPengumuman = () => {
    router.push('/dashboard/admin/pengumuman');
  };

  const handleNavigateToUsers = () => {
    router.push('/dashboard/admin/users');
  };

  const handleNavigateToRegistrants = () => {
    router.push('/dashboard/users');
  };

  const renderStatsCard = (
    title: string,
    value: number,
    icon: string,
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info',
    onClick?: () => void
  ) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8]
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {loading ? '...' : value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette[color].main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Iconify 
              icon={icon} 
              width={24} 
              sx={{ color: 'white' }} 
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Stack spacing={2}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mingcute:announcement-line" />}
          onClick={handleNavigateToPengumuman}
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Kelola Pengumuman
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:users-group-rounded-bold" />}
          onClick={handleNavigateToUsers}
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Kelola Users
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:user-plus-bold" />}
          onClick={handleNavigateToRegistrants}
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Kelola Pendaftar
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <DashboardContent>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            {renderStatsCard(
              'Total Users',
              stats.totalUsers,
              'solar:users-group-rounded-bold',
              'primary',
              handleNavigateToUsers
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {renderStatsCard(
              'Total Pendaftar',
              stats.totalRegistrants,
              'solar:user-plus-bold',
              'success',
              handleNavigateToRegistrants
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {renderStatsCard(
              'Total Pengumuman',
              stats.totalPengumuman,
              'mingcute:announcement-line',
              'info',
              handleNavigateToPengumuman
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {renderStatsCard(
              'Pengumuman Aktif',
              stats.activePengumuman,
              'solar:bell-bing-bold',
              'warning'
            )}
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Pengumuman Management Section */}
              <Paper sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3 
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Kelola Pengumuman
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Buat, edit, dan kelola pengumuman untuk semua pengguna
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleNavigateToPengumuman}
                  >
                    Kelola
                  </Button>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    label={`${stats.totalPengumuman} Total`}
                    color="default"
                    variant="outlined"
                  />
                  <Chip
                    label={`${stats.activePengumuman} Aktif`}
                    color="success"
                    variant="filled"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Pengumuman membantu menyampaikan informasi penting kepada calon siswa, 
                  admin, dan panitia. Anda dapat membuat pengumuman dengan berbagai tipe 
                  dan tingkat prioritas.
                </Typography>
              </Paper>

              {/* Other admin sections can be added here */}
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Quick Actions */}
              {renderQuickActions()}

              {/* Pengumuman Widget */}
              <PengumumanWidget
                targetAudience="admin"
                maxItems={3}
                showViewAll={true}
                onViewAll={handleNavigateToPengumuman}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}
