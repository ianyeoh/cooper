import { initContract } from "@ts-rest/core";
import { z } from "zod";
import authContract from "./routes/public/authContract";
import protectedContract from "./routes/protected/protectedContract";

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
        protectedRoutes: protectedContract,
    },
    {
        pathPrefix: "/api",
        commonResponses: {
            500: c.type<{
                error: string;
            }>(),
        },
        strictStatusCodes: true,
    }
);
export type ContractType = typeof contract;
