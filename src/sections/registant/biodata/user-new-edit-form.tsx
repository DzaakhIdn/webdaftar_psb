import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { api } from "@/routes/paths";
import { updateData, handleAvatarUpload } from "@/models";

import { fData } from "@/utils/format-number";

import { Label } from "@/components/label";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Form, Field } from "@/components/hook-form";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { Registant } from "@/models/types/registant";
import { showAllData } from "@/models";

// ----------------------------------------------------------------------

export const RegistantDisplaySchema = zod.object({
  avatar_url: zod.string().optional(),
  nama_lengkap: zod.string().min(1, { message: "Nama lengkap is required!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  no_hp: zod.string().min(1, { message: "No. HP is required!" }),
  nik: zod.string().min(1, { message: "NIK is required!" }),
  kk: zod.string().min(1, { message: "No. KK is required!" }),
  tempat_lahir: zod.string().min(1, { message: "Tempat lahir is required!" }),
  tanggal_lahir: zod.string().min(1, { message: "Tanggal lahir is required!" }),
  jenis_kelamin: zod
    .enum(["", "laki-laki", "perempuan"])
    .refine((val) => val !== "", {
      message: "Jenis kelamin is required!",
    }),
  sekolah_asal: zod.string().min(1, { message: "Sekolah asal is required!" }),
  alamat_jalan: zod.string().min(1, { message: "Alamat is required!" }),
  rt: zod.string().min(1, { message: "RT is required!" }),
  rw: zod.string().min(1, { message: "RW is required!" }),
  desa_kelurahan: zod
    .string()
    .min(1, { message: "Desa/Kelurahan is required!" }),
  kecamatan: zod.string().min(1, { message: "Kecamatan is required!" }),
  kabupaten_kota: zod
    .string()
    .min(1, { message: "Kabupaten/Kota is required!" }),
  provinsi: zod.string().min(1, { message: "Provinsi is required!" }),
  kode_pos: zod.string().min(1, { message: "Kode pos is required!" }),
  nama_ayah: zod.string().min(1, { message: "Nama ayah is required!" }),
  pekerjaan_ayah: zod
    .string()
    .min(1, { message: "Pekerjaan ayah is required!" }),
  pendidikan_ayah: zod
    .string()
    .min(1, { message: "Pendidikan ayah is required!" }),
  no_hp_ayah: zod.string().min(1, { message: "No. HP ayah is required!" }),
  penghasilan_ayah: zod
    .string()
    .min(1, { message: "Penghasilan ayah is required!" }),
  nama_ibu: zod.string().min(1, { message: "Nama ibu is required!" }),
  pekerjaan_ibu: zod.string().min(1, { message: "Pekerjaan ibu is required!" }),
  pendidikan_ibu: zod
    .string()
    .min(1, { message: "Pendidikan ibu is required!" }),
  no_hp_ibu: zod.string().min(1, { message: "No. HP ibu is required!" }),
  status_pendaftaran: zod.string(),
});

// ----------------------------------------------------------------------

export function UserNewEditForm() {
  const [loading, setLoading] = useState(false);
  const [registant, setRegistant] = useState<Registant[]>([]);
  const { user: currentUser, loading: userLoading } = useCurrentUser(
    api.user.me
  );

  // Get the current registrant data
  const currentRegistrant =
    registant.find((r) => r.email === currentUser?.email) || registant[0];

  // Load data saat component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await showAllData("calonsiswa");
        setRegistant(data);
      } catch (error) {
        // Error loading data
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const defaultValues = {
    avatar_url: "" as string,
    nama_lengkap: "",
    email: "",
    no_hp: "",
    nik: "",
    kk: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "" as "laki-laki" | "perempuan" | "",
    sekolah_asal: "",
    alamat_jalan: "",
    rt: "",
    rw: "",
    desa_kelurahan: "",
    kecamatan: "",
    kabupaten_kota: "",
    provinsi: "",
    kode_pos: "",
    nama_ayah: "",
    pekerjaan_ayah: "",
    pendidikan_ayah: "",
    no_hp_ayah: "",
    penghasilan_ayah: "",
    nama_ibu: "",
    pekerjaan_ibu: "",
    pendidikan_ibu: "",
    no_hp_ibu: "",
    status_pendaftaran: "",
  };

  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(RegistantDisplaySchema),
    defaultValues,
  });

  // Update form values when registrant data is loaded
  useEffect(() => {
    if (currentRegistrant) {
      methods.reset({
        avatar_url: currentRegistrant.avatar_url || "",
        nama_lengkap: currentRegistrant.nama_lengkap || "",
        email: currentRegistrant.email || "",
        no_hp: currentRegistrant.no_hp || "",
        nik: currentRegistrant.nik || "",
        kk: currentRegistrant.kk || "",
        tempat_lahir: currentRegistrant.tempat_lahir || "",
        tanggal_lahir: currentRegistrant.tanggal_lahir || "",
        jenis_kelamin:
          (currentRegistrant.jenis_kelamin as "" | "laki-laki" | "perempuan") ||
          "",
        sekolah_asal: currentRegistrant.sekolah_asal || "",
        alamat_jalan: currentRegistrant.alamat_jalan || "",
        rt: currentRegistrant.rt || "",
        rw: currentRegistrant.rw || "",
        desa_kelurahan: currentRegistrant.desa_kelurahan || "",
        kecamatan: currentRegistrant.kecamatan || "",
        kabupaten_kota: currentRegistrant.kabupaten_kota || "",
        provinsi: currentRegistrant.provinsi || "",
        kode_pos: currentRegistrant.kode_pos || "",
        nama_ayah: currentRegistrant.nama_ayah || "",
        pekerjaan_ayah: currentRegistrant.pekerjaan_ayah || "",
        pendidikan_ayah: currentRegistrant.pendidikan_ayah || "",
        no_hp_ayah: currentRegistrant.no_hp_ayah || "",
        penghasilan_ayah: currentRegistrant.penghasilan_ayah || "",
        nama_ibu: currentRegistrant.nama_ibu || "",
        pekerjaan_ibu: currentRegistrant.pekerjaan_ibu || "",
        pendidikan_ibu: currentRegistrant.pendidikan_ibu || "",
        no_hp_ibu: currentRegistrant.no_hp_ibu || "",
        status_pendaftaran: currentRegistrant.status_pendaftaran || "",
      });
    }
  }, [currentRegistrant, methods]);

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    if (!currentRegistrant) {
      toast.error("Data registrant tidak ditemukan!");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for update (exclude avatar_url from main data)
      const { avatar_url, ...updatePayload } = data;

      // Update registrant data
      await updateData(
        "calonsiswa",
        currentRegistrant.id_siswa,
        "id_siswa",
        updatePayload
      );

      // Handle avatar upload if there's a new file
      if (
        avatar_url &&
        typeof avatar_url === "string" &&
        avatar_url.startsWith("data:")
      ) {
        try {
          // Convert base64 to file
          const response = await fetch(avatar_url);
          const blob = await response.blob();
          const file = new File(
            [blob],
            `avatar_${currentRegistrant.id_siswa}.jpg`,
            { type: "image/jpeg" }
          );
          const avatarResult = await handleAvatarUpload(
            file,
            String(currentRegistrant.id_siswa)
          );

          // Update avatar URL in database
          await updateData(
            "calonsiswa",
            currentRegistrant.id_siswa,
            "id_siswa",
            {
              avatar_url: avatarResult.publicUrl,
            }
          );
        } catch (avatarError) {
          toast.error("Gagal upload avatar, tapi data lain berhasil disimpan");
        }
      }

      // Refresh data
      const refreshedData = await showAllData("calonsiswa");
      setRegistant(refreshedData);

      toast.success("Data berhasil diupdate!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal update data");
    } finally {
      setLoading(false);
    }
  });

  if (userLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Typography>Loading data registrant...</Typography>
      </Box>
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 6, pb: 5, px: 3, position: "relative" }}>
            {currentRegistrant && (
              <Label
                color={
                  (values.status_pendaftaran === "diterima" && "success") ||
                  (values.status_pendaftaran === "ditolak" && "error") ||
                  (values.status_pendaftaran === "sedang tes" && "info") ||
                  "warning"
                }
                sx={{ position: "absolute", top: 16, right: 16 }}
              >
                {values.status_pendaftaran || "pending"}
              </Label>
            )}

            <Box
              sx={{
                mb: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Integrated Avatar Upload */}
              <Controller
                name="avatar_url"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const handleFileChange = async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const file = event.target.files?.[0];
                    if (file && currentRegistrant) {
                      // Validate file size (max 3MB)
                      if (file.size > 3 * 1024 * 1024) {
                        toast.error("Ukuran file terlalu besar! Maksimal 3MB");
                        return;
                      }

                      // Validate file type
                      if (!file.type.startsWith("image/")) {
                        toast.error("File harus berupa gambar!");
                        return;
                      }
                      try {
                        setLoading(true);

                        // Show preview immediately
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          field.onChange(e.target?.result);
                        };
                        reader.readAsDataURL(file);

                        // Upload to storage (will replace existing file with same name)
                        const avatarResult = await handleAvatarUpload(
                          file,
                          String(currentRegistrant.id_siswa)
                        );

                        // Update database with new avatar URL
                        await updateData(
                          "calonsiswa",
                          currentRegistrant.id_siswa,
                          "id_siswa",
                          {
                            avatar_url: avatarResult.publicUrl,
                          }
                        );

                        toast.success("Avatar berhasil diupload dan disimpan!");

                        // Refresh registrant data
                        const refreshedData = await showAllData("calonsiswa");
                        setRegistant(refreshedData);

                        // Update form with new data
                        const updatedRegistrant = refreshedData.find(
                          (r: any) => r.id_siswa === currentRegistrant.id_siswa
                        );
                        if (updatedRegistrant) {
                          methods.reset({
                            ...methods.getValues(),
                            avatar_url: updatedRegistrant.avatar_url || "",
                          });
                        }
                      } catch (error) {
                        toast.error(
                          `Gagal upload avatar: ${
                            error instanceof Error
                              ? error.message
                              : "Unknown error"
                          }`
                        );
                      } finally {
                        setLoading(false);
                      }
                    }
                  };

                  // Priority: form value (preview) > database value > fallback
                  const avatarSrc =
                    field.value || currentRegistrant?.avatar_url;
                  const userName =
                    currentRegistrant?.nama_lengkap || values.nama_lengkap;

                  return (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <Avatar
                        src={
                          typeof avatarSrc === "string" ? avatarSrc : undefined
                        }
                        alt={userName}
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: 48,
                          fontWeight: "bold",
                          border: "1px dashed",
                          borderColor: error ? "error.main" : "grey.400",
                          bgcolor: "grey.100",
                          color: "grey.400",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "all 0.3s ease",
                          opacity: loading ? 0.7 : 1,
                          "&:hover": {
                            transform: loading ? "none" : "scale(1.05)",
                            borderColor: "grey.400",
                          },
                        }}
                        onClick={() => {
                          if (!loading) {
                            document.getElementById("avatar-upload")?.click();
                          }
                        }}
                      >
                        {!avatarSrc &&
                          (userName?.charAt(0)?.toUpperCase() || "U")}
                      </Avatar>

                      {/* Loading Overlay */}
                      {loading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "50%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            📤
                          </Typography>
                        </Box>
                      )}

                      {/* Upload Button Overlay */}
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "grey.500",
                          color: "white",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            bgcolor: "grey.400",
                          },
                        }}
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                      >
                        <Iconify
                          icon="solar:camera-minimalist-bold-duotone"
                          width={19}
                        />
                      </IconButton>

                      {/* Hidden File Input */}
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </Box>
                  );
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  textAlign: "center",
                  color: loading ? "text.secondary" : "text.disabled",
                }}
              >
                {loading ? (
                  <>
                    📤 Uploading avatar...
                    <br />
                    Gambar baru akan mengganti yang lama
                  </>
                ) : (
                  <>
                    Click avatar to upload photo
                    <br />
                    Allowed *.jpeg, *.jpg, *.png, *.gif (max {fData(3145728)})
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ color: "warning.main", fontSize: "0.7rem" }}
                    >
                      ⚠️ Gambar baru akan mengganti gambar sebelumnya
                    </Typography>
                  </>
                )}
              </Typography>
            </Box>

            {/* User Summary */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: "medium", mb: 1 }}>
                {currentRegistrant?.nama_lengkap || "Nama belum diisi"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {currentRegistrant?.email || "Email belum diisi"}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Data Pribadi */}
            <Card sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
              >
                📋 Data Pribadi
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                <Box
                  sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / 3" } }}
                >
                  <Field.Text name="nama_lengkap" label="Nama Lengkap" />
                </Box>
                <Field.Text name="email" label="Email" />
                <Field.Text
                  name="no_hp"
                  label="No. HP"
                  slotProps={{
                    textField: {
                      placeholder: "08123456789",
                    },
                  }}
                />
                <Field.Text name="nik" label="NIK" />
                <Field.Text name="kk" label="No. KK" />
                <Field.Text name="tempat_lahir" label="Tempat Lahir" />
                <Field.Text
                  name="tanggal_lahir"
                  label="Tanggal Lahir"
                  type="date"
                />
                <Field.Select
                  name="jenis_kelamin"
                  label="Jenis Kelamin"
                  helperText=""
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </Field.Select>
                <Field.Text name="sekolah_asal" label="Sekolah Asal" />
              </Box>
            </Card>

            {/* Data Alamat */}
            <Card sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
              >
                🏠 Data Alamat
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                }}
              >
                <Box
                  sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / -1" } }}
                >
                  <Field.Text name="alamat_jalan" label="Alamat Jalan" />
                </Box>
                <Field.Text name="rt" label="RT" />
                <Field.Text name="rw" label="RW" />
                <Field.Text name="kode_pos" label="Kode Pos" />
                <Field.Text name="desa_kelurahan" label="Desa/Kelurahan" />
                <Field.Text name="kecamatan" label="Kecamatan" />
                <Field.Text name="kabupaten_kota" label="Kabupaten/Kota" />
                <Field.Text name="provinsi" label="Provinsi" />
              </Box>
            </Card>

            {/* Data Orang Tua */}
            <Card sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
              >
                👨‍👩‍👧‍👦 Data Orang Tua
              </Typography>

              {/* Data Ayah */}
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "medium" }}
              >
                Data Ayah
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                  mb: 4,
                }}
              >
                <Field.Text name="nama_ayah" label="Nama Ayah" />
                <Field.Text name="pekerjaan_ayah" label="Pekerjaan Ayah" />
                <Field.Text name="pendidikan_ayah" label="Pendidikan Ayah" />
                <Field.Text name="no_hp_ayah" label="No. HP Ayah" />
                <Field.Text name="penghasilan_ayah" label="Penghasilan Ayah" />
              </Box>

              {/* Data Ibu */}
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "medium" }}
              >
                Data Ibu
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <Field.Text name="nama_ibu" label="Nama Ibu" />
                <Field.Text name="pekerjaan_ibu" label="Pekerjaan Ibu" />
                <Field.Text name="pendidikan_ibu" label="Pendidikan Ibu" />
                <Field.Text name="no_hp_ibu" label="No. HP Ibu" />
              </Box>
            </Card>

            <Stack sx={{ alignItems: "center", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting || loading}
                size="large"
                sx={{ minWidth: 200 }}
                disabled={!currentRegistrant}
              >
                {loading ? "Menyimpan..." : "Update Data"}
              </Button>
              <Typography variant="caption" color="text.secondary">
                Pastikan semua data sudah benar sebelum menyimpan
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
