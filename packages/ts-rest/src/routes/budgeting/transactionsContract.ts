import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const transactionsContract = c.router(
    {
        getTransactions: {
            method: "GET",
            path: "/",
            responses: {
                200: z.object({
                    records: z.array(
                        z.object({
                            account: z.object({
                                name: z.string().min(1),
                                bank: z.string().min(1),
                            }),
                            date: z.date(),
                            description: z.string(),
                            category: z.object({
                                name: z.string().min(1),
                            }),
                            amount: z.number().finite().safe(),
                            comments: z.string().optional().nullable(),
                            createdBy: z
                                .object({
                                    firstName: z.string().min(1),
                                    lastName: z.string().min(1),
                                })
                                .optional(),
                            createdAt: z.date(),
                            updatedAt: z.date(),
                        })
                    ),
                }),
            },
            summary: "Get transaction list",
        },
        newTransaction: {
            method: "POST",
            path: "/",
            body: z.object({
                accountId: z.string().min(1),
                date: z.date(),
                description: z.string().min(1),
                categoryId: z.string().min(1),
                amount: z.number().finite().safe(),
                comments: z.string().optional().nullable(),
            }),
            responses: {
                200: z.object({
                    message: z.literal("Transaction created successfully"),
                }),
                400: z.object({
                    error: z.literal("Invalid input"),
                    reason: z.string().min(1),
                }),
            },
            summary: "Get transaction list",
        },
    },
    {
        commonResponses: {
            401: z.object({
                error: z.literal("Unauthorised"),
            }),
        },
        pathPrefix: "/transactions",
    }
);

export default transactionsContract;
