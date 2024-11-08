import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DataTableTextFilterProps<TData> {
    table: Table<TData>;
    filteredColumn: string;
}

export default function DataTableTextFilter<TData>({
    table,
    filteredColumn,
}: DataTableTextFilterProps<TData>) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <Input
            placeholder={isDesktop ? "Search by description..." : "Search..."}
            value={
                (table.getColumn(filteredColumn)?.getFilterValue() as string) ??
                ""
            }
            onChange={(event) =>
                table
                    .getColumn(filteredColumn)
                    ?.setFilterValue(event.target.value)
            }
            className="w-[100px] flex-0 sm:flex-1"
        />
    );
}
