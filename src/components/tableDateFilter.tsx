"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/ui/dateRangeFilter";

export default function DataTableDateFilter() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
        <div>
            <DateRangeFilter
                date={dateRange}
                onDateRangeChange={setDateRange}
            />
        </div>
    );
}
