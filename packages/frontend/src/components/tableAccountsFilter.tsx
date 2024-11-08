import { Dispatch, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function DataTableAccountsFilter({
    accounts,
    selectedAccount,
    onAccountChange,
}: {
    accounts: string[];
    selectedAccount: string | undefined;
    onAccountChange: Dispatch<string | undefined>;
}) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between gap-2",
                        !selectedAccount && "text-muted-foreground"
                    )}
                >
                    <CreditCard size={15} />

                    {selectedAccount
                        ? accounts.find((item) => item === selectedAccount)
                        : "Account"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search account..." />
                    <CommandList>
                        <CommandEmpty>{"No accounts found."}</CommandEmpty>
                        <CommandGroup>
                            {accounts.map((account) => (
                                <CommandItem
                                    key={account}
                                    value={account}
                                    onSelect={(currentValue) => {
                                        onAccountChange(
                                            currentValue === selectedAccount
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedAccount === account
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {account}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
