"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { Iconify } from "@/components/iconify";

// Schema for user update
const updateUserSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  role: z.string().min(1, "Role wajib dipilih"),
  gender: z.enum(["ikhwan", "akhwat"], {
    required_error: "Gender wajib dipilih",
  }),
  password_hash: z.string().optional(),
  phone_numbers: z
    .array(
      z.object({
        nama_nomor: z.string().min(1, "Nama nomor wajib diisi"),
        nomor_hp: z.string().min(1, "Nomor HP wajib diisi"),
        gender: z.enum(["ikhwan", "akhwat"]).optional(),
        role: z.string().optional(),
      })
    )
    .optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: "admin_ikhwan", label: "Admin Ikhwan" },
  { value: "admin_akhwat", label: "Admin Akhwat" },
  { value: "bendahara_ikhwan", label: "Bendahara Ikhwan" },
  { value: "bendahara_akhwat", label: "Bendahara Akhwat" },
  { value: "panitia_ikhwan", label: "Panitia Ikhwan" },
  { value: "panitia_akhwat", label: "Panitia Akhwat" },
];

export function EditUserDialog({
  open,
  onClose,
  user,
  onSuccess,
}: EditUserDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      nama_lengkap: "",
      role: "",
      gender: "ikhwan",
      password_hash: "",
      phone_numbers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phone_numbers",
  });

  // Load user data when dialog opens
  useEffect(() => {
    if (open && user) {
      console.log("🔄 Loading user data into form:", user);
      form.reset({
        username: user.username || "",
        nama_lengkap: user.nama_lengkap || "",
        role: user.role || "",
        gender: user.gender || "ikhwan",
        password_hash: "",
        phone_numbers:
          user.phone_numbers?.map((phone: any) => ({
            nama_nomor: phone.nama_nomor || "",
            nomor_hp: phone.nomor_hp || "",
            gender: phone.gender || user.gender,
            role: phone.role || user.role?.split("_")[0],
          })) || [],
      });
      console.log("✅ Form reset with values:", {
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        gender: user.gender,
        phone_count: user.phone_numbers?.length || 0,
      });
    }
  }, [open, user, form]);

  const handleSubmit = async (data: UpdateUserFormData) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/dashboard/admin/users/${user.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("User berhasil diupdate!");
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal mengupdate user");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Terjadi kesalahan saat mengupdate user");
    } finally {
      setLoading(false);
    }
  };

  const addPhoneNumber = () => {
    append({
      nama_nomor: "",
      nomor_hp: "",
      gender: form.watch("gender"),
      role: form.watch("role")?.split("_")[0] || "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit User: {user?.username}</DialogTitle>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            {/* Basic User Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Informasi User
              </Typography>

              <Stack spacing={2}>
                <TextField
                  {...form.register("username")}
                  label="Username"
                  fullWidth
                  error={!!form.formState.errors.username}
                  helperText={form.formState.errors.username?.message}
                />

                <TextField
                  {...form.register("nama_lengkap")}
                  label="Nama Lengkap"
                  fullWidth
                  error={!!form.formState.errors.nama_lengkap}
                  helperText={form.formState.errors.nama_lengkap?.message}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      label="Role"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      label="Gender"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      <MenuItem value="ikhwan">Ikhwan</MenuItem>
                      <MenuItem value="akhwat">Akhwat</MenuItem>
                    </TextField>
                  )}
                />

                <TextField
                  {...form.register("password_hash")}
                  label="Password Baru (kosongkan jika tidak ingin mengubah)"
                  type="password"
                  fullWidth
                  error={!!form.formState.errors.password_hash}
                  helperText={form.formState.errors.password_hash?.message}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Phone Numbers */}
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Nomor HP</Typography>
                <Button
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addPhoneNumber}
                  variant="outlined"
                  size="small"
                >
                  Tambah Nomor
                </Button>
              </Box>

              {fields.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Belum ada nomor HP. Klik "Tambah Nomor" untuk menambahkan.
                </Typography>
              )}

              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="subtitle2">
                        Nomor HP #{index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => remove(index)}
                        color="error"
                        size="small"
                      >
                        <Iconify icon="mingcute:delete-2-line" />
                      </IconButton>
                    </Box>

                    <Stack spacing={2}>
                      <TextField
                        {...form.register(`phone_numbers.${index}.nama_nomor`)}
                        label="Nama Nomor (contoh: Admin, Bendahara)"
                        fullWidth
                        size="small"
                        error={
                          !!form.formState.errors.phone_numbers?.[index]
                            ?.nama_nomor
                        }
                        helperText={
                          form.formState.errors.phone_numbers?.[index]
                            ?.nama_nomor?.message
                        }
                      />

                      <TextField
                        {...form.register(`phone_numbers.${index}.nomor_hp`)}
                        label="Nomor HP"
                        fullWidth
                        size="small"
                        error={
                          !!form.formState.errors.phone_numbers?.[index]
                            ?.nomor_hp
                        }
                        helperText={
                          form.formState.errors.phone_numbers?.[index]?.nomor_hp
                            ?.message
                        }
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
