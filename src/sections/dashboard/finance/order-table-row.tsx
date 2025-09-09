import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuList from "@mui/material/MenuList";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Fab from "@mui/material/Fab";

import { RouterLink } from "@/routes/components";

import { fCurrency } from "@/utils/format-number";
import { fDate, fTime } from "@/utils/format-time";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomPopover } from "@/components/custom-popover";

// ----------------------------------------------------------------------
interface Payment {
  kode_bayar: string;
  tanggal_bayar: string;
  jenis_bayar: string | null;
  bukti_bayar_path: string | null;
  jumlah_bayar: number;
  status_verifikasi: string;
  diverifikasi_oleh?: string | number;
  diverifikasi_oleh_nama?: string;
  tanggal_verifikasi?: string;
}

interface OrderTableRowProps {
  row: any & {
    pembayaran?: Payment[];
  };
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onApprovePayment?: (kode_bayar: string) => void;
  onRejectPayment?: (kode_bayar: string) => void;
  detailsHref: string;
}

export function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onApprovePayment,
  onRejectPayment,
  detailsHref,
}: OrderTableRowProps) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  const renderPrimaryRow = () => (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          slotProps={{
            input: {
              id: `${row.id_biaya}-checkbox`,
              "aria-label": `${row.id_biaya} checkbox`,
            },
          }}
        />
      </TableCell>

      <TableCell>
        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          underline="always"
        >
          {row.kode_bayar}
        </Link>
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
          <Avatar alt={row.nama_siswa}>
            {row.nama_siswa.charAt(0).toUpperCase()}
          </Avatar>

          <Stack
            sx={{
              typography: "body2",
              flex: "1 1 auto",
              alignItems: "flex-start",
            }}
          >
            <Box component="span">{row.nama_siswa}</Box>

            <Box component="span" sx={{ color: "text.disabled" }}>
              {row.register_id}
            </Box>
          </Stack>
        </Box>
      </TableCell>

      <TableCell>{row.tanggal_bayar}</TableCell>

      <TableCell> Rp {row.jumlah_bayar.toLocaleString("id-ID")}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status_verifikasi === "diterima" && "success") ||
            (row.status_verifikasi === "pending" && "warning") ||
            (row.status_verifikasi === "ditolak" && "error") ||
            "default"
          }
        >
          {row.status_verifikasi}
        </Label>
      </TableCell>

      <TableCell align="center">
        {row.pembayaran &&
        row.pembayaran.length > 0 &&
        row.pembayaran[0].diverifikasi_oleh_nama ? (
          <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {row.pembayaran[0].diverifikasi_oleh_nama}
          </Box>
        ) : (
          <Box sx={{ color: "text.disabled", fontSize: "0.875rem" }}>-</Box>
        )}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        <IconButton
          color={collapseRow.value ? "inherit" : "default"}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: "action.hover" }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton
          color={menuActions.open ? "inherit" : "default"}
          onClick={menuActions.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: "none" }} colSpan={9}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          <Paper sx={{ m: 1.5 }}>
            {/* Display all payments for this user */}
            {row.pembayaran && row.pembayaran.length > 0 ? (
              row.pembayaran.map((payment: Payment, index: number) => (
                <Box
                  key={`${payment.kode_bayar}-${index}`}
                  sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    p: theme.spacing(1.5, 2, 1.5, 1.5),
                    "&:not(:last-of-type)": {
                      borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  })}
                >
                  <Avatar
                    src={payment.bukti_bayar_path || undefined}
                    variant="rounded"
                    sx={{ width: 50, height: 50, mr: 2 }}
                  >
                    {payment.bukti_bayar_path ? undefined : (
                      <Iconify icon="solar:file-text-bold" />
                    )}
                  </Avatar>

                  <ListItemText
                    primary={payment.jenis_bayar || "Pembayaran"}
                    secondary={
                      <Stack spacing={0.5}>
                        <Box component="span">{payment.kode_bayar}</Box>
                        <Box
                          component="span"
                          sx={{ color: "text.disabled", fontSize: "0.75rem" }}
                        >
                          {fDate({ date: new Date(payment.tanggal_bayar) })} •{" "}
                          {fTime({ date: new Date(payment.tanggal_bayar) })}
                        </Box>
                      </Stack>
                    }
                    slotProps={{
                      primary: {
                        sx: { typography: "body2", fontWeight: "medium" },
                      },
                      secondary: {
                        sx: { mt: 0.5 },
                      },
                    }}
                  />

                  <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                    {payment.bukti_bayar_path && (
                      <Button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = payment.bukti_bayar_path!;
                          link.download = `bukti_bayar_${payment.kode_bayar}`;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        variant="soft"
                        color="info"
                        size="small"
                      >
                        <Iconify icon="solar:eye-bold-duotone" width={20} />
                      </Button>
                    )}

                    {/* Action buttons for pending payments */}
                    {payment.status_verifikasi === "pending" && (
                      <>
                        <Button
                          onClick={() => onApprovePayment?.(payment.kode_bayar)}
                          variant="soft"
                          color="success"
                          size="small"
                          startIcon={
                            <Iconify
                              icon="solar:check-circle-bold"
                              width={16}
                            />
                          }
                        >
                          Konfirmasi
                        </Button>
                        <Button
                          onClick={() => onRejectPayment?.(payment.kode_bayar)}
                          variant="soft"
                          color="error"
                          size="small"
                          startIcon={
                            <Iconify
                              icon="solar:close-circle-bold"
                              width={16}
                            />
                          }
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                  </Stack>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: "center", color: "text.disabled" }}>
                Tidak ada data pembayaran
              </Box>
            )}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "right-top" } }}
    >
      <MenuList>
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

        <li>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li>
      </MenuList>
    </CustomPopover>
  );

  const renderConfrimDialog = () => (
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

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
      {renderMenuActions()}
      {renderConfrimDialog()}
    </>
  );
}
