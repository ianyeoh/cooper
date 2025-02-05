import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Budgeting$Account, Budgeting$AccountSchema } from "../../../types";

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
            body: Budgeting$AccountSchema.omit({
                accountId: true,
                workspace: true,
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
        /*
         * These routes are separated and restricted by accountId
         */
        byId: c.router(
            {
                updateAccount: {
                    method: "POST",
                    path: "/",
                    body: Budgeting$AccountSchema.omit({
                        accountId: true,
                        workspace: true,
                    }).partial(),
                    responses: {
                        200: z.object({
                            message: z.literal("Account updated successfully"),
                        }),
                        400: z.object({
                            error: z.literal("Invalid input"),
                            reason: z.string().min(1),
                        }),
                    },
                },
                deleteAccount: {
                    method: "POST",
                    path: "/delete",
                    body: z.any(),
                    responses: {
                        200: z.object({
                            message: z.literal("Account deleted successfully"),
                        }),
                    },
                },
            },
            {
                pathPrefix: "/:accountId",
                pathParams: Budgeting$AccountSchema.pick({
                    accountId: true,
                }),
                commonResponses: {
                    404: z.object({
                        error: z.literal("Account does not exist"),
                    }),
                },
            }
        ),
    },
    {
        pathPrefix: "/accounts",
    }
);

export default accountsContract;
