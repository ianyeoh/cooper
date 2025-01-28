import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Budgeting$Transaction } from "../../../types";

const c = initContract();

const transactionsContract = c.router(
    {
        getTransactions: {
            method: "GET",
            path: "/",
            responses: {
                200: c.type<Budgeting$Transaction[]>(),
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
