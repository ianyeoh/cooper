import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const accountsContract = c.router(
    {
        getAccounts: {
            method: "GET",
            path: "/",
            responses: {
                200: z.object({
                    accounts: z.array(
                        z.object({
                            name: z.string().min(1),
                            bank: z.string().min(1),
                            description: z
                                .string()
                                .min(1)
                                .optional()
                                .nullable(),
                            owner: z.object({
                                firstName: z.string().min(1),
                                lastName: z.string().min(1),
                            }),
                        })
                    ),
                }),
            },
            summary: "Get list of accounts",
        },
        newAccount: {
            method: "POST",
            path: "/",
            body: z.object({
                name: z.string().min(1),
                bank: z.string().min(1),
                description: z.string().min(1).optional().nullable(),
                ownerId: z.string().min(1),
            }),
            responses: {
                200: z.object({
                    message: z.literal("Account created successfully"),
                }),
                400: z.object({
                    error: z.literal("Invalid input"),
                    reason: z.string().min(1),
                }),
            },
            summary: "Create a new account",
        },
    },
    {
        commonResponses: {
            401: z.object({
                error: z.literal("Unauthorised"),
            }),
        },
        pathPrefix: "/accounts",
    }
);

export default accountsContract;
