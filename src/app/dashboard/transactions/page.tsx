import { headers } from "next/headers";
import TransactionsTable from "@/components/transactionsTable";
import Transaction from "@/lib/schemas/db/transactions";
import { endOfDay, isValid, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

async function getTransactionData(
    dateRange: DateRange | undefined,
    account: string | undefined
) {
    const transactionQuery: {
        date?: {
            $gte?: Date;
            $lte?: Date;
        };
        account?: string;
    } = {};

    // Add date range to query
    if (dateRange && (dateRange.from || dateRange.to)) {
        const dateQuery: { $gte?: Date; $lte?: Date } = {};
        if (dateRange.from) dateQuery.$gte = startOfDay(dateRange.from);
        if (dateRange.to) dateQuery.$lte = endOfDay(dateRange.to);
        transactionQuery.date = dateQuery;
    }

    // Add account to query
    transactionQuery.account = account;

    return await Transaction.find(transactionQuery);
}

function parseDateRange(from: string | undefined, to: string | undefined) {
    if (from == null || to == null) {
        return undefined;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (!isValid(fromDate) && !isValid(toDate)) {
        return undefined;
    }

    return {
        from: isValid(fromDate) ? fromDate : undefined,
        to: isValid(toDate) ? toDate : undefined,
    };
}

export default async function TransactionsPage({
    searchParams, // next.js URL search params
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const headersList = headers();

    let from, to, initialAccount;
    if (searchParams != null) {
        from = searchParams.from;
        to = searchParams.to;
        initialAccount = searchParams.account;
    }

    const initialDateRange = parseDateRange(from, to);
    const transactionData = await getTransactionData(
        initialDateRange,
        initialAccount
    );

    return (
        <div className="mt-2 w-full">
            <TransactionsTable
                initialData={transactionData}
                initialDateRange={initialDateRange}
                initialAccount={initialAccount}
                serverHostname={headersList.get("host") ?? "localhost"}
            />
        </div>
    );
}
