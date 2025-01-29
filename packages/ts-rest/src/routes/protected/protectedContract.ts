import { initContract } from "@ts-rest/core";
import { z } from "zod";
import budgetingContract from "./budgeting/budgetingContract";
import usersContract from "./users/usersContract";

const c = initContract();

/*
 * All routes in this contract should be protected with authentication.
 * Hence the routes should share a common 401 Unauthorised response.
 */
const protectedContract = c.router(
    {
        users: usersContract,
        budgeting: budgetingContract,
    },
    {
        pathPrefix: "/",
        commonResponses: {
            401: z.object({
                error: z.literal("Unauthorised"),
            }),
        },
    }
);

export default protectedContract;
