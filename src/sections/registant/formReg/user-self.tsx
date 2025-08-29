"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input/input";

import { Box, Grid, MenuItem, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { Form, Field, schemaHelper } from "@/components/hook-form";
import { FormField } from "@/components/ui/form";

// ----------------------------------------------------------------------

const userSelfSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nik: z.string().min(1, "NIK harus diisi"),
  kk: z.string().min(1, "No. KK harus diisi"),
  tempat_lahir: z.string().min(2, "Tempat lahir harus diisi"),
  tanggal_lahir: z.string().min(1, "Tanggal lahir harus diisi"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Jenis kelamin harus dipilih",
  }),
  anak_ke: z.string().min(1, "Anak ke berapa harus diisi"),
  jumlah_saudara: z.string().min(1, "Jumlah saudara harus diisi"),
  no_hp: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  email: z.string().email("Email tidak valid"),
});

type UserSelfFormValues = z.infer<typeof userSelfSchema>;

export function UserSelf() {
  const form = useForm<UserSelfFormValues>({
    resolver: zodResolver(userSelfSchema),
    defaultValues: {
      nama_lengkap: "",
      nik: "",
      kk: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: undefined,
      anak_ke: "",
      jumlah_saudara: "",
      no_hp: "",
      email: "",
    },
  });

  const onSubmit = (data: UserSelfFormValues) => {
    console.log("User Self Data:", data);
    // Handle form submission here
  };

  return (
    <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <FormField
          control={form.control}
          name="nama_lengkap"
          render={({ field }) => (
            <TextField
              {...field}
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              variant="outlined"
              multiline
              value={field.value}
            />
          )}
        />

        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <TextField
              {...field}
              label="NIK"
              placeholder="Masukkan NIK"
              variant="outlined"
              multiline
              value={field.value}
            />
          )}
        />
        <FormField
          control={form.control}
          name="kk"
          render={({ field }) => (
            <TextField
              {...field}
              label="No. KK"
              placeholder="Masukkan No. KK"
              variant="outlined"
              multiline
              value={field.value}
            />
          )}
        />
        <FormField
          control={form.control}
          name="tempat_lahir"
          render={({ field }) => (
            <TextField
              {...field}
              label="Tempat Lahir"
              placeholder="Masukkan tempat lahir"
              variant="outlined"
              multiline
              value={field.value}
            />
          )}
        />
        <FormField
          control={form.control}
          name="tanggal_lahir"
          render={({ field }) => (
            <DatePicker
              openTo="year"
              views={["year", "month", "day"]}
              label="Year, month and date"
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) =>
                field.onChange(date ? date.format("YYYY-MM-DD") : "")
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          )}
        />

        <FormField
          control={form.control}
          name="jenis_kelamin"
          render={({ field }) => (
            <TextField
              {...field}
              label="Jenis Kelamin"
              variant="outlined"
              select
              value={field.value}
            >
              <MenuItem value="Laki-laki">Laki-laki</MenuItem>
              <MenuItem value="Perempuan">Perempuan</MenuItem>
            </TextField>
          )}
        />
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button type="submit" variant="soft" size="large" color="info">
          Simpan Data Diri
        </Button>
      </Box>
    </Form>
  );
}
