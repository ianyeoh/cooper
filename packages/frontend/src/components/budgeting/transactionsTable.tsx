"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTablePagination } from "@/components/tables/tablePagination";
import { DataTableViewOptions } from "@/components/tables/tableViewOptions";
import NewTransactionButton from "@/components/budgeting/newTransactionBtn";
import DataTableTextFilter from "@/components/tables/tableTextFilter";
import DataTable from "@/components/tables/dataTable";
import DataTableAccountsFilter from "@/components/tables/tableAccountsFilter";
import TableDateRangeFilter from "@/components/tables/tableDateRangeFilter";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";

// import { DataTableColumnHeader } from "@/components/tableColumnHeader";

type TransactionType = ClientInferResponseBody<typeof contract.transactions.getTransactions, 200>["records"][0];

// Use currencyAUD.format(number) to format integers as AUD currency
const currencyAUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  trailingZeroDisplay: "stripIfInteger",
});

const columns: ColumnDef<TransactionType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.original.date, "dd/MM/yyy"),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => currencyAUD.format(row.original.amount / 100),
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return <TransactionActions transaction={transaction} />;
    },
  },
];

function TransactionActions({ transaction }: { transaction: TransactionType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.description)}>
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TransactionsTable({
  initialTransactions,
  initialDateFilter,
  initialAccountFilter,
}: {
  initialTransactions: TransactionType[];
  initialDateFilter: DateRange | undefined;
  initialAccountFilter: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<TransactionType[]>(initialTransactions);

  /* Table data filters */
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateFilter);
  const [account, setAccount] = useState<string | undefined>(initialAccountFilter);

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function query(key: string, value: string | undefined) {
    if (!value) {
      const existingQuery = searchParams.get(key);
      if (!existingQuery) {
        return "";
      }
      return `${key}=${existingQuery}`;
    }
    return `${key}=${value}`;
  }

  /* Re-fetch data from server when filters change. Avoids fetching on first load. */
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      /* Do something meaningful */
      console.log("Date range/account changed");
      router.replace(`?${query("dateRange", JSON.stringify(dateRange))}&${query("account", account)}`, {
        scroll: true,
      });
    }
  }, [dateRange, account]);

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2 items-center w-full">
        <DataTableTextFilter table={table} filteredColumn="description" />
        <DataTableViewOptions table={table} />

        <DataTableAccountsFilter accounts={["CBA", "NZ"]} selectedAccount={account} onAccountChange={setAccount} />
        <TableDateRangeFilter date={dateRange} onDateRangeChange={setDateRange} />
        <div className="ml-auto">
          <NewTransactionButton />
        </div>
      </div>
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
    </div>
  );
}
