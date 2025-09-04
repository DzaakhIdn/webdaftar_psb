"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { DashboardContent } from "@/layout/dashboard";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Form, Field, schemaHelper } from "@/components/hook-form";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { paths } from "@/routes/paths";

// =======================================================================

const WebSettingsSchema = zod.object({
  // Informasi Sekolah
  schoolName: zod.string().min(1, "Nama sekolah wajib diisi"),
  schoolAddress: zod.string().min(1, "Alamat sekolah wajib diisi"),
  schoolPhone: zod.string().min(1, "Nomor telepon wajib diisi"),
  schoolEmail: zod.string().email({ message: "Format email tidak valid" }),
  schoolWebsite: zod
    .string()
    .url({ message: "Format website tidak valid" })
    .optional()
    .or(zod.literal("")),
  schoolDescription: zod.string().min(1, "Deskripsi sekolah wajib diisi"),

  // Logo & Branding
  schoolLogo: zod.union([zod.string(), zod.instanceof(File)]).nullable(),
  favicon: zod
    .union([zod.string(), zod.instanceof(File)])
    .nullable()
    .optional(),

  // Pengaturan Pendaftaran
  registrationStartDate: zod.string().nullable(),
  registrationEndDate: zod.string().nullable(),
  maxStudents: zod.number().min(1, "Jumlah maksimal siswa minimal 1"),
  registrationFee: zod.number().min(0, "Biaya pendaftaran tidak boleh negatif"),

  // Pengaturan Sistem
  maintenanceMode: zod.boolean(),
  allowRegistration: zod.boolean(),
  emailNotifications: zod.boolean(),
  smsNotifications: zod.boolean(),

  // Media Sosial
  facebookUrl: zod
    .string()
    .url({ message: "Format URL Facebook tidak valid" })
    .optional()
    .or(zod.literal("")),
  instagramUrl: zod
    .string()
    .url({ message: "Format URL Instagram tidak valid" })
    .optional()
    .or(zod.literal("")),
  twitterUrl: zod
    .string()
    .url({ message: "Format URL Twitter tidak valid" })
    .optional()
    .or(zod.literal("")),
  youtubeUrl: zod
    .string()
    .url({ message: "Format URL YouTube tidak valid" })
    .optional()
    .or(zod.literal("")),
});

type WebSettingsSchemaType = zod.infer<typeof WebSettingsSchema>;

const TABS = [
  { value: "school", label: "Informasi Sekolah", icon: "solar:buildings-bold" },
  { value: "branding", label: "Logo & Branding", icon: "solar:palette-bold" },
  {
    value: "registration",
    label: "Pengaturan Pendaftaran",
    icon: "solar:calendar-bold",
  },
  { value: "system", label: "Sistem", icon: "solar:settings-bold" },
  { value: "social", label: "Media Sosial", icon: "solar:share-bold" },
];

const defaultValues = {
  schoolName: "HSI Boarding School",
  schoolAddress: "Cikembar Sukabumi",
  schoolPhone: "021-12345678",
  schoolEmail: "info@hsiboa.sch.id",
  schoolWebsite: "https://smaithsi.sch.id",
  schoolDescription:
    "HSI Boarding School merupakan sekolah asrama yang berada di Jakarta dengan fasilitas lengkap dan tenaga pengajar berkualitas.",
  schoolLogo: null as string | File | null,
  favicon: null as string | File | null,
  registrationStartDate: null as string | null,
  registrationEndDate: null as string | null,
  maxStudents: 500,
  registrationFee: 250000,
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  smsNotifications: false,
  facebookUrl: "https://facebook.com/sman1jakarta",
  instagramUrl: "https://instagram.com/sman1jakarta",
  twitterUrl: "",
  youtubeUrl: "",
} satisfies Partial<WebSettingsSchemaType>;

// =======================================================================

export function WebSettingsView() {
  const [currentTab, setCurrentTab] = useState("school");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<WebSettingsSchemaType>({
    resolver: zodResolver(WebSettingsSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const onSubmit = useCallback(async (data: WebSettingsSchemaType) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Settings data:", data);
      toast.success("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan!");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    reset(defaultValues);
    toast.info("Pengaturan direset ke nilai default");
  }, [reset]);

  const renderSchoolInfo = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Informasi Sekolah
      </Typography>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Field.Text name="schoolName" label="Nama Sekolah" />
          <Field.Text name="schoolPhone" label="Nomor Telepon" />
        </Box>
        <Field.Text
          name="schoolAddress"
          label="Alamat Sekolah"
          slotProps={{
            textField: { multiline: true, rows: 2 },
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Field.Text name="schoolEmail" label="Email Sekolah" type="email" />
          <Field.Text name="schoolWebsite" label="Website Sekolah" />
        </Box>
        <Field.Text
          name="schoolDescription"
          label="Deskripsi Sekolah"
          helperText="Deskripsi singkat tentang sekolah yang akan ditampilkan di website"
          slotProps={{
            textField: { multiline: true, rows: 4 },
          }}
        />
      </Stack>
    </Card>
  );

  const renderBranding = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Logo & Branding
      </Typography>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Logo Sekolah
          </Typography>
          <Field.UploadAvatar
            name="schoolLogo"
            helperText="Upload logo sekolah (format: PNG, JPG, SVG. Maksimal 2MB)"
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Favicon
          </Typography>
          <Field.UploadBox
            name="favicon"
            placeholder="Upload favicon (16x16 atau 32x32 pixels)"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Favicon akan ditampilkan di tab browser
          </Typography>
        </Box>
      </Stack>
    </Card>
  );

  const renderRegistrationSettings = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Pengaturan Pendaftaran
      </Typography>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Field.DatePicker
            name="registrationStartDate"
            label="Tanggal Buka Pendaftaran"
            slotProps={{}}
          />
          <Field.DatePicker
            name="registrationEndDate"
            label="Tanggal Tutup Pendaftaran"
            slotProps={{}}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Field.NumberInput
            name="maxStudents"
            captionText="Maksimal Siswa"
            helperText="Jumlah maksimal siswa yang dapat mendaftar"
          />
          <Field.NumberInput
            name="registrationFee"
            captionText="Biaya Pendaftaran (Rp)"
            helperText="Biaya pendaftaran dalam rupiah"
          />
        </Box>
        <Stack spacing={2}>
          <Field.Switch
            name="allowRegistration"
            label="Buka Pendaftaran"
            helperText=""
            slotProps={{}}
            sx={{}}
          />
          <Typography variant="caption" color="text.secondary">
            Aktifkan untuk membuka pendaftaran siswa baru
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderSystemSettings = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Pengaturan Sistem
      </Typography>
      <Stack spacing={3}>
        <Field.Switch
          name="maintenanceMode"
          label="Mode Maintenance"
          helperText=""
          slotProps={{}}
          sx={{}}
        />
        <Typography variant="caption" color="text.secondary">
          Aktifkan untuk menutup sementara akses ke website
        </Typography>

        <Divider />

        <Typography variant="subtitle2">Notifikasi</Typography>
        <Stack spacing={2}>
          <Field.Switch
            name="emailNotifications"
            label="Notifikasi Email"
            helperText=""
            slotProps={{}}
            sx={{}}
          />
          <Field.Switch
            name="smsNotifications"
            label="Notifikasi SMS"
            helperText=""
            slotProps={{}}
            sx={{}}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderSocialMedia = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Media Sosial
      </Typography>
      <Stack spacing={3}>
        <Field.Text
          name="facebookUrl"
          label="Facebook URL"
          helperText="https://facebook.com/namaSekolah"
        />
        <Field.Text
          name="instagramUrl"
          label="Instagram URL"
          helperText="https://instagram.com/namaSekolah"
        />
        <Field.Text
          name="twitterUrl"
          label="Twitter URL"
          helperText="https://twitter.com/namaSekolah"
        />
        <Field.Text
          name="youtubeUrl"
          label="YouTube URL"
          helperText="https://youtube.com/@namaSekolah"
        />
      </Stack>
    </Card>
  );

  const renderCurrentTab = () => {
    switch (currentTab) {
      case "school":
        return renderSchoolInfo();
      case "branding":
        return renderBranding();
      case "registration":
        return renderRegistrationSettings();
      case "system":
        return renderSystemSettings();
      case "social":
        return renderSocialMedia();
      default:
        return renderSchoolInfo();
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Pengaturan Website"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Admin", href: paths.dashboard.admin.root },
          { name: "Pengaturan Website" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
              bgcolor: "background.neutral",
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={<Iconify icon={tab.icon} />}
                iconPosition="start"
              />
            ))}
          </Tabs>

          <Divider />

          <Box sx={{ p: 3 }}>
            {renderCurrentTab()}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleReset}
                startIcon={<Iconify icon="solar:restart-bold" />}
              >
                Reset
              </Button>

              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon="solar:diskette-bold" />}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Form>
    </DashboardContent>
  );
}
