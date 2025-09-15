import { useBoolean, usePopover } from "minimal-shared/hooks";
import { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import { RouterLink } from "@/routes/components";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomPopover } from "@/components/custom-popover";
import { useToast } from "@/components/providers/toast-provider";

import { UserQuickEditForm } from "./user-quick-edit-form";
import {
  sendWhatsAppMessage,
  type RegistrantData,
} from "@/models/whatsapp-service";
import {
  updateRegistrantStatus,
  STATUS_OPTIONS,
  type RegistrantStatus,
} from "@/models/update-registrant-status";

// ----------------------------------------------------------------------

interface UserRowData {
  id_siswa: string;
  nama_lengkap: string;
  register_id: string;
  email: string;
  sekolah_asal: string;
  no_hp: string;
  status_pendaftaran:
    | "pending"
    | "verifikasi berkas"
    | "verifikasi pembayaran"
    | "tes wawancara"
    | "sedang tes"
    | "diterima"
    | "ditolak";
  jalur_final_id: string | null;
  password_hash?: string;
  jalurfinal: {
    kode_final: string;
    nama_jalur_final: string;
    jalur: {
      nama_jalur: string;
    }[];
  } | null;
}

interface UserTableRowProps {
  row: UserRowData;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onUpdateRow?: (updatedData: UserRowData) => void;
}

export function UserTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: UserTableRowProps) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const editStatusDialog = useBoolean();
  const { showSuccess, showError } = useToast();

  const [selectedStatus, setSelectedStatus] = useState<RegistrantStatus>(
    row.status_pendaftaran || "pending"
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  // Handle WhatsApp message sending
  const handleSendWhatsApp = async () => {
    if (!row.no_hp) {
      showError("Nomor HP tidak tersedia");
      return;
    }

    setIsSendingWhatsApp(true);
    try {
      const registrantData: RegistrantData = {
        id_siswa: row.id_siswa,
        nama_lengkap: row.nama_lengkap,
        register_id: row.register_id,
        no_hp: row.no_hp,
        status_pendaftaran: row.status_pendaftaran,
        password_hash: row.password_hash,
        jalurfinal: row.jalurfinal,
      };

      console.log("Sending WhatsApp with data:", registrantData);
      const result = await sendWhatsAppMessage(registrantData);

      if (result.success) {
        showSuccess("WhatsApp berhasil dibuka dengan pesan otomatis!");
      } else {
        showError(result.error || "Gagal mengirim pesan WhatsApp");
      }
    } catch (error) {
      console.error("Error sending WhatsApp:", error);
      showError("Terjadi kesalahan saat mengirim pesan WhatsApp");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (selectedStatus === row.status_pendaftaran) {
      editStatusDialog.onFalse();
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const result = await updateRegistrantStatus(row.id_siswa, selectedStatus);

      if (result.success) {
        showSuccess("Status berhasil diperbarui!");
        editStatusDialog.onFalse();

        // Update parent component data
        if (onUpdateRow) {
          onUpdateRow({
            ...row,
            status_pendaftaran: selectedStatus,
          });
        }
      } else {
        showError(result.error || "Gagal memperbarui status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showError("Terjadi kesalahan saat memperbarui status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={row}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
        <li>
          <MenuItem
            component={RouterLink}
            href={editHref}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold-duotone" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            editStatusDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: "info.main" }}
        >
          <Iconify icon="solar:settings-bold-duotone" />
          Edit Status
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

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

  const renderEditStatusDialog = () => (
    <Dialog
      open={editStatusDialog.value}
      onClose={editStatusDialog.onFalse}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Status Pendaftar</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status Pendaftaran</InputLabel>
            <Select
              value={selectedStatus}
              label="Status Pendaftaran"
              onChange={(e) =>
                setSelectedStatus(e.target.value as RegistrantStatus)
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={editStatusDialog.onFalse} color="inherit">
          Batal
        </Button>
        <Button
          onClick={handleUpdateStatus}
          variant="contained"
          disabled={
            isUpdatingStatus || selectedStatus === row.status_pendaftaran
          }
        >
          {isUpdatingStatus ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id_siswa}-checkbox`,
                "aria-label": `${row.id_siswa} checkbox`,
              },
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
            <Avatar alt={row.nama_lengkap}>
              {row.nama_lengkap.charAt(0).toUpperCase()}
            </Avatar>

            <Stack
              sx={{
                typography: "body2",
                flex: "1 1 auto",
                alignItems: "flex-start",
              }}
            >
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: "pointer" }}
              >
                {row.nama_lengkap}
              </Link>
              <Box component="span" sx={{ color: "text.disabled" }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.register_id}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.no_hp}</TableCell>

        <TableCell sx={{ maxWidth: 200 }}>
          <Tooltip title={row.sekolah_asal} placement="top" arrow>
            <Box
              component="span"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.sekolah_asal}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {row.jalurfinal?.nama_jalur_final || "-"}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status_pendaftaran === "diterima" && "success") ||
              (row.status_pendaftaran === "ditolak" && "error") ||
              (row.status_pendaftaran === "verifikasi berkas" && "info") ||
              (row.status_pendaftaran === "verifikasi pembayaran" && "info") ||
              (row.status_pendaftaran === "tes wawancara" && "primary") ||
              (row.status_pendaftaran === "sedang tes" && "warning") ||
              "default"
            }
          >
            {row.status_pendaftaran}
          </Label>
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Kirim Pesan WhatsApp" placement="top" arrow>
              <IconButton
                color={isSendingWhatsApp ? "inherit" : "success"}
                onClick={handleSendWhatsApp}
                disabled={isSendingWhatsApp || !row.no_hp}
              >
                <Iconify icon="solar:plain-bold-duotone" />
              </IconButton>
            </Tooltip>

            <IconButton
              color={menuActions.open ? "inherit" : "default"}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
      {renderEditStatusDialog()}
    </>
  );
}
