import { z } from "zod";
import { authedProcedure, t } from "../trpc.ts";
import BudgetTransaction from "../db/budgetTransaction.ts";

export const transactionsRouter = t.router({
    transactions: authedProcedure
        .output(
            z.object({
                records: z.array(
                    z.object({
                        account: z.string().min(1),
                        date: z.date(),
                        description: z.string(),
                        category: z.string().min(1),
                        amount: z.number().finite().safe(),
                        comments: z.string().optional(),
                    })
                ),
            })
        )
        .query(async () => {
            const totalRecords = await BudgetTransaction.countDocuments(
                {}
            ).exec();
            const records = await BudgetTransaction.find().exec();

            return {
                records,
                totalRecords,
            };
        }),
});

// export type definition of API
export type TransactionsRouter = typeof transactionsRouter;
export default transactionsRouter;
