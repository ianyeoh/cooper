import { initContract } from "@ts-rest/core";
import authContract from "./routes/authContract.ts";
import transactionsContract from "./routes/transactionsContract.ts";
import usersContract from "./routes/usersContract.ts";
import { z } from "zod";

const c = initContract();

/**
 * The main contract for ts-rest. Combines all sub-contracts which
 * are split into separate files for better readability.
 */
export const contract = c.router(
    {
        status: {
            method: "GET",
            path: "/status",
            responses: {
                200: z.object({
                    database: z.string().min(1),
                }),
            },
            summary: "Get health status of server",
        },
        auth: authContract,
        transactions: transactionsContract,
        users: usersContract,
    },
    {
        commonResponses: {
            404: c.type<{ message: "Not Found"; reason: string }>(),
            500: c.otherResponse({
                contentType: "text/plain",
                body: z.literal("Server Error"),
            }),
        },
    }
);
