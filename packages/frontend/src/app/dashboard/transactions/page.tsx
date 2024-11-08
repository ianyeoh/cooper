import { headers } from "next/headers";
import TransactionsTable from "@/components/transactionsTable";
import BudgetTransaction, {
    IBudgetTransaction,
} from "../../../../../schemas/db/budgetTransaction";
import { DateRange } from "react-day-picker";

async function getTransactionData(dateRange: DateRange) {
    let query = BudgetTransaction.find();
    const records = await query.exec();
    return records;
}

export default async function TransactionsPage({
    searchParams, // next.js URL search params
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const headersList = headers();

    let data: IBudgetTransaction[] = [];

    return (
        <div className="mt-2 w-full">
            <TransactionsTable
                initialData={data}
                initialDateRange={undefined}
                initialAccount={undefined}
                serverHostname={headersList.get("host") ?? "localhost"}
            />
        </div>
    );
}
