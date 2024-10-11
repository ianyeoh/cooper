import { TransactionsTable } from "@/components/transactionsTable";
import { IBudgetTransaction } from "@/lib/schemas/db/budgetTransaction";

const transactions: IBudgetTransaction[] = [
    {
        account: "CBA",
        date: new Date(),
        description: "Chubby Buns",
        category: "Food",
        amount: -3299,
    },
    {
        account: "ANZ",
        date: new Date(),
        description: "Metro Liverpool",
        category: "Transportation",
        amount: 5632,
        comments: "For Lexus",
    },
    {
        account: "UBank",
        date: new Date(),
        description: "GYG Liverpool",
        category: "Food",
        amount: 1299,
    },
];

export default function TransactionsPage() {
    return (
        <div className="mt-2 w-full">
            <TransactionsTable data={transactions} />
        </div>
    );
}
