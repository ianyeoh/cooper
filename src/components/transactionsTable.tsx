"use client";

import { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { IBudgetTransaction } from "@/lib/schemas/db/budgetTransaction";
import { DataTablePagination } from "@/components/tablePagination";
import { DataTableViewOptions } from "@/components/tableViewOptions";
import NewTransactionButton from "@/components/newTransactionBtn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DataTableTextFilter from "@/components/tableTextFilter";
import DataTable from "@/components/table";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import DataTableDateFilter from "./tableDateFilter";

// import { DataTableColumnHeader } from "@/components/tableColumnHeader";

// Use currencyAUD.format(number) to generate language-sensitive
const currencyAUD = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    trailingZeroDisplay: "stripIfInteger",
});

const columns: ColumnDef<IBudgetTransaction>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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

function TransactionActions({
    transaction,
}: {
    transaction: IBudgetTransaction;
}) {
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
                <DropdownMenuItem
                    onClick={() =>
                        navigator.clipboard.writeText(transaction.description)
                    }
                >
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TransactionsTable({ data }: { data: IBudgetTransaction[] }) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <div className="w-full space-y-3">
            <div className="flex gap-4 items-center w-full">
                <DataTableTextFilter
                    table={table}
                    filteredColumn="description"
                />
                <DataTableViewOptions table={table} />
                <DataTableDateFilter table={table} filteredColumn="date" />
                <div className="ml-auto">
                    <NewTransactionButton />
                </div>
            </div>
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
        </div>
    );
}
