import { z } from "zod";
import { initContract } from "@ts-rest/core";
import transactionsContract from "./transactionsContract";
import accountsContract from "./accountsContract";
import categoriesContract from "./categoriesContract";
import { Budgeting$Workspace } from "../../../types";

const c = initContract();

const workspacesContract = c.router(
    {
        getWorkspaces: {
            method: "GET",
            path: "/",
            responses: {
                200: c.type<Budgeting$Workspace[]>(),
            },
        },
        accounts: accountsContract,
        categories: categoriesContract,
        transactions: transactionsContract,
    },
    {
        pathPrefix: "/workspaces/:workspaceId",
        pathParams: z.object({
            workspaceId: z.string().min(1).max(50),
        }),
        commonResponses: {
            400: z.object({
                error: z.literal("Invalid workspaceId"),
                reason: z.string().min(1),
            }),
        },
    }
);

export default workspacesContract;
