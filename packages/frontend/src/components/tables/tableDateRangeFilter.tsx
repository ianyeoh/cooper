"use client";

import { Dispatch, HTMLAttributes, ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Check, MoveLeft, MoveRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type SelectionType = "1D" | "7D" | "14D" | "30D" | "90D" | "custom" | undefined;

function DateRangeFilterBtn({
  selected,
  type,
  onSelectChange,
  children,
}: {
  selected: SelectionType;
  type: SelectionType;
  onSelectChange: Dispatch<SelectionType>;
  children: ReactNode;
}) {
  return (
    <Button
      onClick={() => {
        onSelectChange(type);
      }}
      className="justify-start gap-2"
      variant="ghost"
    >
      {type === selected ? <Check size={13} /> : <div className="w-[13px]"></div>}
      {children}
    </Button>
  );
}

export default function TableDateRangeFilter({
  date: dateRange,
  onDateRangeChange,
  className,
}: {
  date: DateRange | undefined;
  onDateRangeChange: Dispatch<DateRange | undefined>;
  prompt?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState<boolean>(false);
  const [openCustomRange, setOpenCustomRange] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [selectionType, setSelectionType] = useState<SelectionType>();

  function toggleSelected(selection: SelectionType) {
    closeFilter();

    if (selection === selectionType) {
      setSelectionType(undefined);
      onDateRangeChange(undefined);
    } else {
      setSelectionType(selection);
      switch (selection) {
        case "1D":
          setDateRangeByDays(1);
          break;
        case "7D":
          setDateRangeByDays(7);
          break;
        case "14D":
          setDateRangeByDays(14);
          break;
        case "30D":
          setDateRangeByDays(30);
          break;
        case "90D":
          setDateRangeByDays(90);
          break;
      }
    }
  }

  function setDateRangeByDays(days: number) {
    onDateRangeChange({
      from: new Date(), // today
      to: addDays(new Date(), -days),
    });
  }

  function closeFilter() {
    setOpen(false);
    setTimeout(() => {
      setOpenCustomRange(false);
    }, 100);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            setOpen(true);
          } else {
            closeFilter();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
            onClick={() => {
              setOpen(true);
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {!dateRange && "Date"}
            {dateRange && selectionType !== "custom" && selectionType}
            {dateRange && selectionType === "custom" && dateRange.from && dateRange.to && (
              <>
                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className={cn(!openCustomRange ? "block animate-in fade-out-0 zoom-out-95" : "hidden")}>
            <div className="flex flex-col gap-1 p-2 w-[200px]">
              <span className="text-sm font-semibold">Filter time range</span>
              <DateRangeFilterBtn selected={selectionType} type="1D" onSelectChange={toggleSelected}>
                Last 24 hours
              </DateRangeFilterBtn>
              <DateRangeFilterBtn selected={selectionType} type="7D" onSelectChange={toggleSelected}>
                Last 7 days
              </DateRangeFilterBtn>
              <DateRangeFilterBtn selected={selectionType} type="14D" onSelectChange={toggleSelected}>
                Last 14 days
              </DateRangeFilterBtn>
              <DateRangeFilterBtn selected={selectionType} type="30D" onSelectChange={toggleSelected}>
                Last 30 days
              </DateRangeFilterBtn>
              <Button
                className="justify-start gap-2"
                variant="ghost"
                onClick={() => {
                  setCustomRange(dateRange);
                  setOpenCustomRange(true);
                }}
              >
                {selectionType === "custom" ? <Check size={13} /> : <div className="w-[13px]"></div>}
                Custom range
                <MoveRight size={13} className="ml-auto" />
              </Button>
            </div>
          </div>

          <ScrollArea className={cn(openCustomRange ? "block animate-in fade-in-0 zoom-in-95" : "hidden", "h-[300px]")}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={customRange}
              onSelect={setCustomRange}
              numberOfMonths={2}
            />
            <div className="flex gap-2 p-2">
              <Button
                variant="ghost"
                className="ml-auto text-sm gap-2"
                onClick={() => {
                  setOpenCustomRange(false);
                }}
              >
                <MoveLeft size={10} />
                Back
              </Button>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  if (customRange == null) {
                    setSelectionType(undefined);
                    onDateRangeChange(undefined);
                  } else {
                    if (customRange.to == null) {
                      customRange.to = customRange.from;
                    }
                    setSelectionType("custom");
                    onDateRangeChange(customRange);
                  }

                  closeFilter();
                }}
              >
                Apply
              </Button>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
