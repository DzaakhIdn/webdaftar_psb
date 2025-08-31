"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, MenuItem, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { api } from "@/routes/paths";
import { useToast } from "@/components/providers/toast-provider";
import { showAllData, updateCalonSiswa, UpdateCalonSiswa } from "@/models";
import { Registant } from "@/models/types/registant";
import { useCurrentUser } from "@/hooks/getCurrentUsers";

// ----------------------------------------------------------------------

type JalurFinal = {
  id_jalur_final: number;
  nama_jalur_final: string;
  jenis_kelamin: string;
  jalur: {
    id_jalur: number;
    nama_jalur: string;
    kode_jalur: string;
  };
};

const userSelfSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nik: z.string().min(1, "NIK harus diisi"),
  kk: z.string().min(1, "No. KK harus diisi"),
  tempat_lahir: z.string().min(2, "Tempat lahir harus diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir harus diisi"),
  jenis_kelamin: z
    .string()
    .refine((val) => ["laki-laki", "perempuan"].includes(val), {
      message: "Jenis kelamin harus laki-laki atau perempuan",
    }),
  jalur_final_id: z.number().optional(),
  no_hp: z
    .string()
    .min(1, "No. HP harus diisi")
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
});

type UserSelfFormValues = z.infer<typeof userSelfSchema>;

export function UserSelf() {
  const { showSuccess, showError } = useToast();
  const [jalurFinalOptions, setJalurFinalOptions] = useState<JalurFinal[]>([]);
  const [loading, setLoading] = useState(false);

  const [registant, setRegistant] = useState<Registant[]>([]);
  const [saving, setSaving] = useState(false);
  const [isDefaultsSet, setIsDefaultsSet] = useState(false);

  // Get current logged in user
  const { user: currentUser, loading: userLoading } = useCurrentUser(
    api.user.me
  );

  // Load data siswa
  useEffect(() => {
    const loadRegistantData = async () => {
      try {
        const data = await showAllData("calonsiswa");
        setRegistant(data as Registant[]);
      } catch (error) {
        console.error("Error loading calonsiswa data:", error);
        showError("Failed to load user data");
      }
    };
    loadRegistantData();
  }, [showError]);

  const form = useForm<UserSelfFormValues>({
    resolver: zodResolver(userSelfSchema),
    defaultValues: {
      nama_lengkap: "",
      nik: "",
      kk: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      jalur_final_id: null,
      no_hp: "",
    },
  });

  // Watch gender untuk trigger jalur
  const jenisKelamin = form.watch("jenis_kelamin");

  useEffect(() => {
    if (!jenisKelamin) {
      setJalurFinalOptions([]);
      return;
    }

    setLoading(true);

    fetch(`/api/user/jalur-final?gender=${jenisKelamin}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: JalurFinal[]) => {
        setJalurFinalOptions(data);
      })
      .catch((err) => {
        console.error("Error fetching jalurFinal:", err);
        showError("Gagal memuat data jalur pendaftaran");
      })
      .finally(() => setLoading(false));
  }, [jenisKelamin]);

  // Populate default data
  useEffect(() => {
    if (registant.length > 0 && currentUser && !isDefaultsSet) {
      const userData = registant.find((r) => r.id_siswa === currentUser.id);

      if (userData) {
        form.reset({
          nama_lengkap: userData.nama_lengkap || "",
          nik: userData.nik || "",
          kk: userData.kk || "",
          tempat_lahir: userData.tempat_lahir || "",
          tanggal_lahir: userData.tanggal_lahir || "",
          jenis_kelamin: userData.jenis_kelamin || "",
          jalur_final_id: userData.jalur_final_id
            ? userData.jalur_final_id
            : null,
          no_hp: userData.no_hp || "",
        });

        // Clear any existing errors
        form.clearErrors();
        setIsDefaultsSet(true);
      }
    }
  }, [registant, currentUser, isDefaultsSet, form]);

  const onSubmit = async (data: UserSelfFormValues) => {
    if (!currentUser) {
      showError("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    setSaving(true);

    try {
      const payload: UpdateCalonSiswa = {
        ...data,
        jalur_final_id:
          data.jalur_final_id && data.jalur_final_id !== null
            ? data.jalur_final_id
            : null,
        jenis_kelamin: data.jenis_kelamin.toLowerCase(),
      };
      const updated = await updateCalonSiswa(currentUser.id, payload);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Nama */}
          <FormField
            control={form.control}
            name="nama_lengkap"
            render={({ field }) => (
              <TextField
                {...field}
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                variant="outlined"
              />
            )}
          />

          {/* NIK */}
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <TextField
                {...field}
                label="NIK"
                placeholder="Masukkan NIK"
                variant="outlined"
              />
            )}
          />

          {/* KK */}
          <FormField
            control={form.control}
            name="kk"
            render={({ field }) => (
              <TextField
                {...field}
                label="No. KK"
                placeholder="Masukkan No. KK"
                variant="outlined"
              />
            )}
          />

          {/* Tempat Lahir */}
          <FormField
            control={form.control}
            name="tempat_lahir"
            render={({ field }) => (
              <TextField
                {...field}
                label="Tempat Lahir"
                placeholder="Masukkan tempat lahir"
                variant="outlined"
              />
            )}
          />

          {/* No HP */}
          <FormField
            control={form.control}
            name="no_hp"
            render={({ field }) => (
              <TextField
                {...field}
                label="No. HP"
                placeholder="Masukkan No. HP"
                variant="outlined"
              />
            )}
          />

          {/* Tanggal Lahir */}
          <FormField
            control={form.control}
            name="tanggal_lahir"
            render={({ field }) => (
              <DatePicker
                openTo="year"
                views={["year", "month", "day"]}
                label="Tanggal Lahir"
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) =>
                  field.onChange(date ? date.format("YYYY-MM-DD") : "")
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            )}
          />

          {/* Jenis Kelamin */}
          <FormField
            control={form.control}
            name="jenis_kelamin"
            render={({ field }) => (
              <TextField {...field} label="Jenis Kelamin" select>
                <MenuItem value="">Pilih Jenis Kelamin</MenuItem>
                <MenuItem value="laki-laki">Laki-laki</MenuItem>
                <MenuItem value="perempuan">Perempuan</MenuItem>
              </TextField>
            )}
          />

          {/* Jalur Final */}
          {jenisKelamin ? (
            <FormField
              control={form.control}
              name="jalur_final_id"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Jalur Pendaftaran"
                  select
                  disabled={loading}
                >
                  <MenuItem value="">Pilih Jalur Pendaftaran</MenuItem>
                  {jalurFinalOptions.map((item) => (
                    <MenuItem
                      key={item.id_jalur_final}
                      value={item.id_jalur_final}
                    >
                      {item.nama_jalur_final} ({item.jalur.nama_jalur})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          ) : (
            <TextField
              disabled
              label="Jalur Pendaftaran"
              helperText="Pilih Jenis Kelamin terlebih dahulu"
              fullWidth
            />
          )}
        </Box>

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            type="submit"
            variant="soft"
            sx={{ paddingBlock: "10px" }}
            color="primary"
            disabled={saving || userLoading}
          >
            {saving ? "Menyimpan..." : "Simpan Data Diri"}
          </Button>
        </Box>
      </form>
    </Form>
  );
}
