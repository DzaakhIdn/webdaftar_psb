"use client";

import { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, MenuItem, Button, TextField, Typography } from "@mui/material";
import { Registant } from "@/models/types/registant";
import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { useToast } from "@/components/providers/toast-provider";
import { api } from "@/routes/paths";
import { showAllData, updateCalonSiswa } from "@/models";
import { provinces } from "@/data";

// ============================== Schema ============================= //

const addressSchema = z.object({
  alamat_jalan: z.string().min(10, "Alamat minimal 10 karakter"),
  rt: z.string().min(1, "RT harus diisi").max(3, "RT maksimal 3 digit"),
  rw: z.string().min(1, "RW harus diisi").max(3, "RW maksimal 3 digit"),
  desa_kelurahan: z.string().min(1, "Kelurahan harus diisi"),
  kecamatan: z.string().min(1, "Kecamatan harus diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota harus diisi"),
  provinsi: z.string().min(1, "Provinsi harus diisi"),
  kode_pos: z
    .string()
    .min(5, "Kode pos harus 5 digit")
    .max(5, "Kode pos harus 5 digit"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

// ============================== Component ============================= //

export function AdressForm() {
  const { showSuccess, showError } = useToast();
  const { user: currentUser, loading: userLoading } = useCurrentUser(
    api.user.me
  );
  const [registant, setRegistant] = useState<Registant[]>([]);
  const [saving, setSaving] = useState(false);
  const [isDefaultsSet, setIsDefaultsSet] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      alamat_jalan: "",
      rt: "",
      rw: "",
      desa_kelurahan: "",
      kecamatan: "",
      kabupaten_kota: "",
      provinsi: "",
      kode_pos: "",
    },
  });

  // Load data saat component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await showAllData("calonsiswa");
        setRegistant(data);
      } catch (error) {
        showError("Failed to load user data");
      }
    };

    if (currentUser) {
      loadData();
    }
  }, [currentUser, showError]);

  // Set default values dari database
  useEffect(() => {
    if (registant.length > 0 && currentUser && !isDefaultsSet) {
      const userData = registant.find((r) => r.id_siswa === currentUser.id);
      if (userData) {
        form.reset({
          alamat_jalan: userData.alamat_jalan || "",
          rt: userData.rt || "",
          rw: userData.rw || "",
          desa_kelurahan: userData.desa_kelurahan || "",
          kecamatan: userData.kecamatan || "",
          kabupaten_kota: userData.kabupaten_kota || "",
          provinsi: userData.provinsi || "",
          kode_pos: userData.kode_pos || "",
        });

        // Clear any existing errors
        form.clearErrors();
        setIsDefaultsSet(true);
      }
    }
  }, [registant, currentUser, isDefaultsSet, form]);

  const onSubmit = async (data: AddressFormValues) => {
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
      showSuccess("Data alamat berhasil disimpan!");
      setIsDefaultsSet(false);
    } catch (error) {
      console.error("Error saving address data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menyimpan data alamat";
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Alamat Lengkap
          </Typography>

          {/* Alamat */}
          <FormField
            control={form.control}
            name="alamat_jalan"
            render={({ field }) => (
              <TextField
                {...field}
                label="Alamat Lengkap"
                placeholder="Masukkan alamat lengkap (Jalan, No. Rumah, dll)"
                variant="outlined"
                multiline
                rows={3}
              />
            )}
          />

          {/* RT & RW */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormField
              control={form.control}
              name="rt"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="RT"
                  placeholder="001"
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              )}
            />
            <FormField
              control={form.control}
              name="rw"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="RW"
                  placeholder="001"
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              )}
            />
          </Box>

          {/* Kelurahan */}
          <FormField
            control={form.control}
            name="desa_kelurahan"
            render={({ field }) => (
              <TextField
                {...field}
                label="Kelurahan/Desa"
                placeholder="Masukkan kelurahan/desa"
                variant="outlined"
              />
            )}
          />

          {/* Kecamatan */}
          <FormField
            control={form.control}
            name="kecamatan"
            render={({ field }) => (
              <TextField
                {...field}
                label="Kecamatan"
                placeholder="Masukkan kecamatan"
                variant="outlined"
              />
            )}
          />

          {/* Kabupaten */}
          <FormField
            control={form.control}
            name="kabupaten_kota"
            render={({ field }) => (
              <TextField
                {...field}
                label="Kabupaten/Kota"
                placeholder="Masukkan kabupaten/kota"
                variant="outlined"
              />
            )}
          />

          {/* Provinsi */}
          <FormField
            control={form.control}
            name="provinsi"
            render={({ field }) => (
              <TextField {...field} label="Provinsi" select variant="outlined">
                <MenuItem value="">Pilih Provinsi</MenuItem>
                {provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Kode Pos */}
          <FormField
            control={form.control}
            name="kode_pos"
            render={({ field }) => (
              <TextField
                {...field}
                label="Kode Pos"
                placeholder="12345"
                variant="outlined"
                slotProps={{
                  htmlInput: { maxLength: 5 },
                }}
              />
            )}
          />

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="soft"
              sx={{ paddingBlock: "10px" }}
              color="primary"
              disabled={saving || userLoading}
            >
              {saving ? "Menyimpan..." : "Simpan Data Alamat"}
            </Button>
          </Box>
        </Box>
      </form>
    </Form>
  );
}
