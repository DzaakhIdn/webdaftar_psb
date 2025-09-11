import { useState, useEffect } from "react";
import { useBoolean, usePopover } from "minimal-shared/hooks";
import { toast } from "sonner";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { updateData, showAllData } from "@/models";

import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// ----------------------------------------------------------------------

interface User {
  id: string;
  username: string;
  nama_lengkap: string;
  role: string;
  gender?: string;
}

interface NoHpData {
  id: string;
  nama_nomor: string;
  nomor_hp: string;
  description?: string;
  user_id?: string;
  username?: string;
  user_nama_lengkap?: string;
  user_role?: string;
  user_gender?: string;
  created_at?: string;
}

interface InvoiceTableRowProps {
  row: NoHpData;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onEditRow?: (updatedData: NoHpData) => void;
}

export function ListNoHpTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: InvoiceTableRowProps) {
  const confirmDialog = useBoolean();
  const openDialog = useBoolean();

  // State untuk form edit
  const [formData, setFormData] = useState({
    nama_nomor: row.nama_nomor,
    nomor_hp: row.nomor_hp,
    description: row.description || "",
    user_id: row.user_id || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersData = await showAllData("users");
        if (usersData && Array.isArray(usersData)) {
          setUsers(usersData as User[]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Gagal memuat data users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle dialog open - reset form data
  const handleOpenDialog = () => {
    setFormData({
      nama_nomor: row.nama_nomor,
      nomor_hp: row.nomor_hp,
      description: row.description || "",
      user_id: row.user_id || "",
    });
    openDialog.onTrue();
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (!formData.nama_nomor.trim() || !formData.nomor_hp.trim()) {
      toast.error("Nama nomor dan nomor HP tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update data menggunakan updateData function
      const updatedData = await updateData("no_penting", row.id, "id", {
        nama_nomor: formData.nama_nomor.trim(),
        nomor_hp: formData.nomor_hp.trim(),
        description: formData.description.trim(),
        user_id: formData.user_id || null,
      });

      // Call parent callback if provided
      if (onEditRow && updatedData) {
        onEditRow({
          ...row,
          nama_nomor: formData.nama_nomor.trim(),
          nomor_hp: formData.nomor_hp.trim(),
          description: formData.description.trim(),
          user_id: formData.user_id || undefined,
        });
      }

      toast.success("Data nomor penting berhasil diupdate!");
      openDialog.onFalse();
    } catch (error) {
      console.error("Error updating nomor penting:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengupdate data nomor penting"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  const renderFormDialog = () => (
    <Dialog
      open={openDialog.value}
      onClose={openDialog.onFalse}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Nomor Penting</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3, color: "text.secondary" }}>
          Update informasi nomor penting yang akan digunakan untuk kontak
          darurat atau komunikasi penting.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          margin="dense"
          variant="outlined"
          label="Nama Nomor"
          value={formData.nama_nomor}
          onChange={(e) => handleInputChange("nama_nomor", e.target.value)}
          placeholder="Contoh: Admin Sekolah, Customer Service"
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          label="Nomor HP"
          value={formData.nomor_hp}
          onChange={(e) => handleInputChange("nomor_hp", e.target.value)}
          placeholder="Contoh: 08123456789"
          disabled={isSubmitting}
          slotProps={{
            input: {
              inputMode: "numeric" as const,
            },
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          label="Pemilik Nomor"
          select
          value={formData.user_id}
          onChange={(e) => handleInputChange("user_id", e.target.value)}
          disabled={isSubmitting || loadingUsers}
          sx={{ mb: 2 }}
          helperText="Pilih user yang memiliki nomor ini (opsional)"
        >
          <MenuItem value="">
            <em>Tidak ada pemilik</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{user.nama_lengkap}</Typography>
                <Chip
                  label={user.role}
                  size="small"
                  color={
                    user.role.includes("admin")
                      ? "error"
                      : user.role.includes("panitia")
                      ? "primary"
                      : user.role.includes("bendahara")
                      ? "success"
                      : "default"
                  }
                  sx={{ fontSize: "0.7rem" }}
                />
                {user.gender && (
                  <Chip
                    label={user.gender}
                    size="small"
                    variant="outlined"
                    color={user.gender === "ikhwan" ? "info" : "secondary"}
                    sx={{ fontSize: "0.7rem" }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          label="Keterangan"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Contoh: Kontak admin untuk urusan teknis dan sistem"
          disabled={isSubmitting}
          helperText="Deskripsi singkat tentang fungsi atau peran nomor ini"
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={openDialog.onFalse}
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          onClick={handleEditSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Iconify icon="solar:diskette-bold-duotone" />
            )
          }
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                "aria-label": `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nama_nomor}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.nomor_hp}
            slotProps={{
              primary: { noWrap: true, sx: { typography: "body2" } },
              secondary: { sx: { mt: 0.5, typography: "caption" } },
            }}
          />
        </TableCell>

        <TableCell>
          {row.user_nama_lengkap ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {row.user_nama_lengkap}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Chip
                  label={row.user_role}
                  size="small"
                  color={
                    row.user_role?.includes("admin")
                      ? "error"
                      : row.user_role?.includes("panitia")
                      ? "primary"
                      : row.user_role?.includes("bendahara")
                      ? "success"
                      : "default"
                  }
                  sx={{ fontSize: "0.7rem", height: 20 }}
                />
                {row.user_gender && (
                  <Chip
                    label={row.user_gender}
                    size="small"
                    variant="outlined"
                    color={row.user_gender === "ikhwan" ? "info" : "secondary"}
                    sx={{ fontSize: "0.7rem", height: 20 }}
                  />
                )}
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              Tidak ada pemilik
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {row.description || "Tidak ada keterangan"}
          </Typography>
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton
                color={confirmDialog.value ? "inherit" : "error"}
                onClick={confirmDialog.onTrue}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color={openDialog.value ? "inherit" : "info"}
                onClick={handleOpenDialog}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {renderConfirmDialog()}
      {renderFormDialog()}
    </>
  );
}
