import { initContract } from "@ts-rest/core";
import { z } from "zod";
import protectedContract from "./routes/protected/protectedContract";
import publicContract from "./routes/public/publicContract";

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
        protected: protectedContract,
        public: publicContract,
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
