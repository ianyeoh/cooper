import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

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
            className={cn(isDesktop ? "w-[300px]" : "w-[80px]")}
        />
    );
}
