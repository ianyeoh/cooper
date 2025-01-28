import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const categoriesContract = c.router(
    {
        // getAccounts: {
        //     method: "GET",
        //     path: "/",
        //     responses: {
        //         200: z.object({
        //             accounts: z.array(
        //                 z.object({
        //                     name: z.string().min(1).max(50),
        //                     bank: z.string().min(1).max(50),
        //                     description: z
        //                         .string()
        //                         .min(1)
        //                         .optional()
        //                         .nullable(),
        //                     owner: z.object({
        //                         firstName: z.string().min(1).max(50),
        //                         lastName: z.string().min(1).max(50),
        //                     }),
        //                 })
        //             ),
        //         }),
        //     },
        //     summary: "Get list of categories",
        // },
        // newAccount: {
        //     method: "POST",
        //     path: "/",
        //     body: z.object({
        //         name: z.string().min(1).max(50),
        //         bank: z.string().min(1).max(50),
        //         description: z.string().min(1).optional().nullable(),
        //         ownerId: z.string().min(1).max(50),
        //     }),
        //     responses: {
        //         200: z.object({
        //             message: z.literal("Account created successfully"),
        //         }),
        //         400: z.object({
        //             error: z.literal("Invalid input"),
        //             reason: z.string().min(1),
        //         }),
        //     },
        //     summary: "Create a new account",
        // },
    },
    {
        pathPrefix: "/accounts",
    }
);

export default categoriesContract;
