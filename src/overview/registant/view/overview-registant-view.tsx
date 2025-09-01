"use client";

import { Box, Typography } from "@mui/material";
import { DashboardContent } from "@/layout/dashboard";
import { RegistrationAnnouncement } from "../anouncement";
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
      <Box sx={{  display: "flex", flexDirection: "column", gap: 3 }}>
        <RegistrationAnnouncement />
        <FileUploadReminder />
      </Box>
    </DashboardContent>
  );
}
