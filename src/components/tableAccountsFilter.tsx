import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function DataTableAccountsFilter() {
    const [account, setAccount] = useState<string | undefined>();

    return (
        <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="w-auto">
                <SelectValue placeholder="Accounts" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    <SelectItem value="est"></SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
