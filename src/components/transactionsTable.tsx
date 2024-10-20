"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
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
import { ITransaction } from "@/lib/schemas/db/transactions";
import { DataTablePagination } from "@/components/tablePagination";
import { DataTableViewOptions } from "@/components/tableViewOptions";
import NewTransactionButton from "@/components/newTransactionBtn";
import DataTableTextFilter from "@/components/tableTextFilter";
import DataTable from "@/components/dataTable";
import DataTableAccountsFilter from "@/components/tableAccountsFilter";
import TableDateRangeFilter from "@/components/tableDateRangeFilter";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// import { DataTableColumnHeader } from "@/components/tableColumnHeader";

// Use currencyAUD.format(number) to generate language-sensitive
const currencyAUD = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    trailingZeroDisplay: "stripIfInteger",
});

const columns: ColumnDef<ITransaction>[] = [
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

function TransactionActions({ transaction }: { transaction: ITransaction }) {
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

export default function TransactionsTable({
    initialData,
    initialDateRange,
    initialAccount,
    serverHostname,
}: {
    initialData: ITransaction[];
    initialDateRange: DateRange | undefined;
    initialAccount: string | undefined;
    serverHostname: string;
}) {
    const router = useRouter();
    const [data, setData] = useState<ITransaction[]>(initialData);

    /* Table data filters */
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialDateRange
    );
    const [account, setAccount] = useState<string | undefined>(initialAccount);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    /* Re-fetch data from server when filters change. Avoids fetching on first load. */
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false);
        } else {
            // Build query string
            const queryInput: { [key: string]: string } = {};

            if (dateRange != null) {
                queryInput.from = JSON.stringify(dateRange.from);
                queryInput.to = JSON.stringify(dateRange.to);
            }

            if (account != null) {
                queryInput.account = account;
            }

            const searchParams = new URLSearchParams(queryInput);
            router.replace(`?${searchParams.toString()}`, { scroll: true });
        }
    }, [dateRange, account]);

    return (
        <div className="w-full space-y-3">
            <div className="flex gap-2 items-center w-full">
                <DataTableTextFilter
                    table={table}
                    filteredColumn="description"
                />
                <TableDateRangeFilter
                    date={dateRange}
                    onDateRangeChange={setDateRange}
                />
                <DataTableAccountsFilter
                    accounts={["CBA", "NZ"]}
                    selectedAccount={account}
                    onAccountChange={setAccount}
                />
                <DataTableViewOptions table={table} />
                <div className="ml-auto">
                    <NewTransactionButton />
                </div>
            </div>
            <DataTable table={table} columns={columns} />
            <DataTablePagination
                table={table}
                pageSizes={[10, 20, 30, 40, 50]}
            />
        </div>
    );
}
