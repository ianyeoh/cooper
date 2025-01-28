import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Budgeting$Account } from "../../../types";

const c = initContract();

const accountsContract = c.router(
    {
        getAccounts: {
            method: "GET",
            path: "/",
            responses: {
                200: c.type<Budgeting$Account[]>(),
            },
            summary: "Get list of accounts",
        },
        newAccount: {
            method: "POST",
            path: "/",
            body: z.object({
                name: z.string().min(1).max(50),
                bank: z.string().min(1).max(50),
                description: z.string().min(1).max(255).optional().nullable(),
                ownerId: z.string().min(1).max(50),
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
        pathPrefix: "/accounts",
    }
);

export default accountsContract;
