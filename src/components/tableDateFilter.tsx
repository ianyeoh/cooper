import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DateRangePicker } from "./ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface DataTableDateFilterProps<TData> {
    table: Table<TData>;
    filteredColumn: string;
}

export default function DataTableDateFilter<TData>({
    table,
    filteredColumn,
}: DataTableDateFilterProps<TData>) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div>
            <DateRangePicker
                date={dateRange}
                onDateRangeChange={setDateRange}
                prompt="Date"
                showSelection={false}
            />
        </div>
    );
}
