import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";

interface PaymentRequiredRowProps {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
}

export function PaymentRequiredRow({
  row,
  selected,
  onSelectRow,
}: PaymentRequiredRowProps) {
  return (
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
      <TableCell>{row.nama_biaya}</TableCell>
      <TableCell>Rp {row.jumlah.toLocaleString("id-ID")}</TableCell>
    </TableRow>
  );
}
