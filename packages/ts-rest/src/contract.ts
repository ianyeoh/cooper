import { initContract } from "@ts-rest/core";
import z from "zod";
import protectedContract from "@cooper/ts-rest/src/routes/protected/protectedContract";
import authContract from "@cooper/ts-rest/src/routes/public/authContract";

const c = initContract();

/**
 * The main contract for ts-rest. Combines all sub-contracts which
 * are split into separate files for better readability.
 *
 * General rule of this contract:
 * 2xx statuses always contain the field "message" in the body.
 * 4xx or 5xx statuses always contain the field "error" in the body.
 *
 */
export const contract = c.router(
    {
        protected: protectedContract,
        public: {
            auth: authContract,
        },
    },
    {
        pathPrefix: "/api",
        commonResponses: {
            500: z.object({
                error: z.string().nonempty(),
            }),
        },
        // strictStatusCodes: true,
    }
);
export type ContractType = typeof contract;
