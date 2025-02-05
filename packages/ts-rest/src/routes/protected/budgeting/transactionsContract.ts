import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
    Budgeting$Transaction,
    Budgeting$TransactionSchema,
} from "../../../types";

const c = initContract();

const transactionsContract = c.router(
    {
        getTransactions: {
            method: "GET",
            path: "/",
            responses: {
                200: c.type<Budgeting$Transaction[]>(),
            },
            summary: "Get a list of transactions belonging to the workspace",
        },
        newTransaction: {
            method: "POST",
            path: "/",
            body: Budgeting$TransactionSchema.omit({
                transactionId: true,
                workspace: true,
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
            summary: "Create a new transaction",
        },
        /*
         * These routes are separated and restricted by transactionId
         */
        byId: c.router(
            {
                updateTransaction: {
                    method: "POST",
                    path: "/",
                    body: Budgeting$TransactionSchema.omit({
                        transactionId: true,
                        workspace: true,
                    }).partial(),
                    responses: {
                        200: z.object({
                            message: z.literal(
                                "Transaction updated successfully"
                            ),
                        }),
                        400: z.object({
                            error: z.literal("Invalid input"),
                            reason: z.string().min(1),
                        }),
                    },
                    summary: "Update a transaction by id",
                },
                deleteTransaction: {
                    method: "POST",
                    path: "/delete",
                    body: z.any(),
                    responses: {
                        200: z.object({
                            message: z.literal(
                                "Transaction deleted sucessfully"
                            ),
                        }),
                    },
                    summary: "Delete a transaction by id",
                },
            },
            {
                pathPrefix: "/:transactionId",
                pathParams: Budgeting$TransactionSchema.pick({
                    transactionId: true,
                }),
                commonResponses: {
                    404: z.object({
                        error: z.literal("Transaction does not exist"),
                    }),
                },
            }
        ),
    },
    {
        pathPrefix: "/transactions",
    }
);

export default transactionsContract;
