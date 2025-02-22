import { initContract } from "@ts-rest/core";
import { z } from "zod";
import usersContract from "@cooper/ts-rest/src/routes/protected/users/usersContract";
import workspacesContract from "@cooper/ts-rest/src/routes/protected/budgeting/workspacesContract";

const c = initContract();

/*
 * All routes in this contract should be protected with authentication.
 * Hence the routes should share a common 401 Unauthorised response.
 */
const protectedContract = c.router(
    {
        users: usersContract,
        budgeting: {
            workspaces: workspacesContract,
        },
    },
    {
        pathPrefix: "",
        commonResponses: {
            401: z.object({
                error: z.literal("Unauthorised"),
            }),
        },
    }
);

export default protectedContract;
