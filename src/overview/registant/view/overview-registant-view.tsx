"use client";

import { Box, Typography, Stack } from "@mui/material";
import { DashboardContent } from "@/layout/dashboard";
import { RegistrationAnnouncement } from "../anouncement";
import { PengumumanWidget } from "@/components/pengumuman";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { api } from "@/routes/paths";
import { FileUploadReminder } from "../file-upload-reminder";

export function OverviewRegistantView() {
  const { user } = useCurrentUser(api.user.me);
  const name = user?.nama_lengkap || "User";

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
        pt: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Hi, {name} 👋
        </Typography>
        <Typography
          sx={{ color: "text.secondary" }}
        >{`Selamat datang di dashboard pendaftaran siswa baru!`}</Typography>
      </Box>
      <Stack spacing={3}>
        <RegistrationAnnouncement />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: { lg: 2 } }}>
            <FileUploadReminder />
          </Box>

          <Box sx={{ flex: { lg: 1 } }}>
            <PengumumanWidget
              targetAudience="calon_siswa"
              maxItems={4}
              showViewAll={true}
              onViewAll={() => {
                // Navigate to pengumuman page - you can implement this
                console.log("Navigate to pengumuman page");
              }}
            />
          </Box>
        </Box>
      </Stack>
    </DashboardContent>
  );
}
