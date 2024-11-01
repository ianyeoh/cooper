import { z } from "zod";

export const transactionsSchema = z.object({
    account: z.string().min(2, {
        message: "Account must be at least 2 characters.",
    }),
    date: z.coerce.date(),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    category: z.string().min(2, {
        message: "Category must be at least 2 characters.",
    }),
    amount: z.number(),
    comments: z.string(),
});
export type TransactionsType = z.infer<typeof transactionsSchema>;
