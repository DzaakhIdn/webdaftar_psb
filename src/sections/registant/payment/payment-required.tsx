import { useState, useCallback, useEffect } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Iconify } from "@/components/iconify";

import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "@/components/table";

import { PaymentRequiredRow } from "./payment-required-row";

import { useCurrentUser } from "@/hooks/getCurrentUsers";
import { fetchUnpaidPaymentsByUser } from "@/models/payments-required";
import { api } from "@/routes/paths";
import { Typography } from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";

// ================================= // ============================== //

interface JenisPembayaran {
  id_biaya: number;
  nama_biaya: string;
  jumlah: number;
}

const TABLE_HEAD = [
  { id: "paymentName", label: "Nama Pembayaran", width: 50 },
  { id: "amount", label: "Jumlah Biaya", width: 50 },
];

export function PaymentRequired() {
  const table = useTable();
  const [tableData, setTableData] = useState<JenisPembayaran[]>([]);
  const { user: currentUser } = useCurrentUser(api.user.me);

  useEffect(() => {
    const fetchUnpaidPayments = async () => {
      if (!currentUser?.id) return;

      try {
        const unpaidPayments = await fetchUnpaidPaymentsByUser(currentUser.id);
        setTableData(unpaidPayments);
      } catch (error) {
        console.error("Error fetching unpaid payments:", error);
      }
    };

    fetchUnpaidPayments();
  }, [currentUser]);

  const filtersState = useSetState({
    name: "",
    role: [] as string[],
    status: "all",
  });
  const {
    state: currentFilters,
    setState: updateFilters,
    resetState: resetFilters,
  } = filtersState;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });
  const canReset =
    !!currentFilters.name ||
    currentFilters.role.length > 0 ||
    currentFilters.status !== "all";

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const totalAmount = dataFiltered.reduce((acc, row) => acc + row.jumlah, 0);

  return (
    <Card sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ position: "relative" }}>
        <Scrollbar>
          <Table size={table.dense ? "small" : "medium"} sx={{ minWidth: 500 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id_biaya)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: JenisPembayaran) => (
                  <PaymentRequiredRow
                    key={row.id_biaya}
                    row={row}
                    selected={table.selected.includes(row.id_biaya)}
                    onSelectRow={() => table.onSelectRow(row.id_biaya)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(
                  table.page,
                  table.rowsPerPage,
                  dataFiltered.length
                )}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
        <Card
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>Total Pembayaran:</Typography>
          <Typography variant="h6">Rp {totalAmount.toLocaleString("id-ID")}</Typography>
        </Card>
      </Box>
    </Card>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: JenisPembayaran[];
  comparator: (a: JenisPembayaran, b: JenisPembayaran) => number;
  filters: { name: string; role: string[]; status: string };
}): JenisPembayaran[] {
  const { name, status } = filters;

  const stabilizedThis: [JenisPembayaran, number][] = inputData.map(
    (el, index) => [el, index]
  );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData: JenisPembayaran[] = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter((biaya) => {
      return biaya.nama_biaya.toLowerCase().includes(name.toLowerCase());
    });
  }
  return filteredData;
}
