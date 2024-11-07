import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const transactionsContract = c.router({
    getTransactions: {
        method: "GET",
        path: "/transactions",
        responses: {
            200: z.object({
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
            }),
        },
        summary: "Get transaction list",
    },
});

export default transactionsContract;
