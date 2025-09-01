"use client";

import { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, MenuItem, Button, TextField, Typography } from "@mui/material";
import { Registant } from "@/models/types/registant";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { useToast } from "@/components/providers";
import { api } from "@/routes/paths";
import { showAllData, updateCalonSiswa } from "@/models";
import { educationOptions, incomeOptions } from "@/data";

// ============================== // ============================= //

const parentSchema = z.object({
  nama_ayah: z.string().min(3, "Nama ayah minimal 3 karakter"),
  no_hp_ayah: z
    .string()
    .min(1, "No. HP ayah harus diisi")
    .refine(
      (val) => {
        // Validasi nomor HP Indonesia yang lebih fleksibel
        const cleaned = val.replace(/[\s-+()]/g, "");
        return /^(08|628|62|8)\d{8,12}$/.test(cleaned);
      },
      {
        message: "Format nomor HP tidak valid (contoh: 08123456789)",
      }
    ),
  pekerjaan_ayah: z.string().min(1, "Pekerjaan ayah harus diisi"),
  pendidikan_ayah: z.string().min(1, "Pendidikan ayah harus diisi"),
  penghasilan_ayah: z.string().min(1, "Penghasilan ayah harus diisi"),
  nama_ibu: z.string().min(3, "Nama ibu minimal 3 karakter"),
  no_hp_ibu: z
    .string()
    .min(1, "No. HP ibu harus diisi")
    .refine(
      (val) => {
        // Validasi nomor HP Indonesia yang lebih fleksibel
        const cleaned = val.replace(/[\s-+()]/g, "");
        return /^(08|628|62|8)\d{8,12}$/.test(cleaned);
      },
      {
        message: "Format nomor HP tidak valid (contoh: 08123456789)",
      }
    ),
  pekerjaan_ibu: z.string().min(1, "Pekerjaan ibu harus diisi"),
  pendidikan_ibu: z.string().min(1, "Pendidikan ibu harus diisi"),
});

// ============================== // ============================= //

export function ParentForm() {
  const { showSuccess, showError } = useToast();
  const { user: currentUser, loading: userLoading } = useCurrentUser(
    api.user.me
  );
  const [loading, setLoading] = useState(false);
  const [registant, setRegistant] = useState<Registant[]>([]);
  const [saving, setSaving] = useState(false);
  const [isDefaultsSet, setIsDefaultsSet] = useState(false);

  // Load data siswa
  useEffect(() => {
    const loadRegistantData = async () => {
      try {
        const data = await showAllData("calonsiswa");
        // console.log("Registant data:", data);
        setRegistant(data as Registant[]);
      } catch (error) {
        console.error("Error loading calonsiswa data:", error);
        showError("Failed to load user data");
      }
    };
    loadRegistantData();
  }, [showError]);

  type ParentFormValues = z.infer<typeof parentSchema>;

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      nama_ayah: "",
      no_hp_ayah: "",
      pekerjaan_ayah: "",
      pendidikan_ayah: "",
      penghasilan_ayah: "",
      nama_ibu: "",
      no_hp_ibu: "",
      pekerjaan_ibu: "",
      pendidikan_ibu: "",
    },
  });

  // Populate default data
  useEffect(() => {
    if (registant.length > 0 && currentUser && !isDefaultsSet) {
      const userData = registant.find((r) => r.id_siswa === currentUser.id);

      if (userData) {
        form.reset({
          nama_ayah: userData.nama_ayah || "",
          no_hp_ayah: userData.no_hp_ayah || "",
          pekerjaan_ayah: userData.pekerjaan_ayah || "",
          pendidikan_ayah: userData.pendidikan_ayah || "",
          penghasilan_ayah: userData.penghasilan_ayah || "",
          nama_ibu: userData.nama_ibu || "",
          no_hp_ibu: userData.no_hp_ibu || "",
          pekerjaan_ibu: userData.pekerjaan_ibu || "",
          pendidikan_ibu: userData.pendidikan_ibu || "",
        });

        // Clear any existing errors
        form.clearErrors();
        setIsDefaultsSet(true);
      }
    }
  }, [registant, currentUser, isDefaultsSet, form]);

  const onSubmit = async (data: ParentFormValues) => {
    if (!currentUser) {
      showError("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateCalonSiswa(currentUser.id, data);
      setRegistant((prev) =>
        prev.map((r) =>
          r.id_siswa === currentUser.id ? { ...r, ...updated } : r
        )
      );
      form.reset(updated);
      showSuccess("Data berhasil disimpan!");
      setIsDefaultsSet(false);
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menyimpan data";
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Data Ayah
          </Typography>
          {/* Nama Ayah */}
          <FormField
            control={form.control}
            name="nama_ayah"
            render={({ field }) => (
              <TextField
                {...field}
                label="Nama Lengkap Ayah"
                placeholder="Masukkan nama lengkap"
                variant="outlined"
              />
            )}
          />
          {/* No HP Ayah */}
          <FormField
            control={form.control}
            name="no_hp_ayah"
            render={({ field }) => (
              <TextField
                {...field}
                label="No. HP Ayah"
                placeholder="Masukkan No. HP"
                variant="outlined"
              />
            )}
          />
          {/* Pekerjaan Ayah */}
          <FormField
            control={form.control}
            name="pekerjaan_ayah"
            render={({ field }) => (
              <TextField
                {...field}
                label="Pekerjaan"
                placeholder="Masukkan pekerjaan"
                variant="outlined"
              />
            )}
          />
          {/* Pendidikan Ayah */}
          <FormField
            control={form.control}
            name="pendidikan_ayah"
            render={({ field }) => (
              <TextField
                {...field}
                label="Pendidikan Ayah"
                select
                variant="outlined"
              >
                <MenuItem value="">Pilih Pendidikan</MenuItem>
                {educationOptions.map((education) => (
                  <MenuItem key={education} value={education}>
                    {education}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {/* Penghasilan Ayah */}
          <FormField
            control={form.control}
            name="penghasilan_ayah"
            render={({ field }) => (
              <TextField
                {...field}
                label="Penghasilan Ayah"
                select
                variant="outlined"
              >
                <MenuItem value="">Pilih Penghasilan</MenuItem>
                {incomeOptions.map((income) => (
                  <MenuItem key={income} value={income}>
                    {income}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Data Ibu
          </Typography>
          {/* Nama Ibu */}
          <FormField
            control={form.control}
            name="nama_ibu"
            render={({ field }) => (
              <TextField
                {...field}
                label="Nama Lengkap Ibu"
                placeholder="Masukkan nama lengkap"
                variant="outlined"
              />
            )}
          />

          {/* No HP Ibu */}
          <FormField
            control={form.control}
            name="no_hp_ibu"
            render={({ field }) => (
              <TextField
                {...field}
                label="No. HP Ibu"
                placeholder="Masukkan No. HP"
                variant="outlined"
              />
            )}
          />
          {/* Pekerjaan Ibu */}
          <FormField
            control={form.control}
            name="pekerjaan_ibu"
            render={({ field }) => (
              <TextField
                {...field}
                label="Pekerjaan"
                placeholder="Masukkan pekerjaan"
                variant="outlined"
              />
            )}
          />
          {/* Pendidikan Ibu */}
          <FormField
            control={form.control}
            name="pendidikan_ibu"
            render={({ field }) => (
              <TextField
                {...field}
                label="Pendidikan Ibu"
                select
                variant="outlined"
              >
                <MenuItem value="">Pilih Pendidikan</MenuItem>
                {educationOptions.map((education) => (
                  <MenuItem key={education} value={education}>
                    {education}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {/* Submit */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="soft"
              sx={{ paddingBlock: "10px" }}
              color="primary"
            >
              Simpan Data Orang Tua
            </Button>
          </Box>
        </Box>
      </form>
    </Form>
  );
}
