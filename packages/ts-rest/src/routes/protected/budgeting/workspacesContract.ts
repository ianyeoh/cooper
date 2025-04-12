import { z } from "zod";
import { initContract } from "@ts-rest/core";
import transactionsContract from "@cooper/ts-rest/src/routes/protected/budgeting/transactionsContract";
import accountsContract from "@cooper/ts-rest/src/routes/protected/budgeting/accountsContract";
import categoriesContract from "@cooper/ts-rest/src/routes/protected/budgeting/categoriesContract";
import { Budgeting$WorkspaceSchema } from "@cooper/ts-rest/src/types";

const c = initContract();

const workspacesContract = c.router(
    {
        getWorkspaces: {
            method: "GET",
            path: "/",
            responses: {
                200: z.object({
                    workspaces: z.array(Budgeting$WorkspaceSchema),
                }),
            },
            summary: "Get a list of workspaces",
        },
        newWorkspace: {
            method: "POST",
            path: "/",
            body: z.any(),
            responses: {
                200: z.object({
                    message: z.literal("Workspace created successfully"),
                }),
                400: z.object({
                    error: z.literal("Invalid input"),
                    reason: z.string().min(1),
                }),
            },
            summary: "Create a new workspace",
        },

        /*
         * These routes are separated and restricted by workspaceId
         */
        byId: c.router(
            {
                updateWorkspace: {
                    method: "POST",
                    path: "/",
                    body: Budgeting$WorkspaceSchema.omit({ workspaceId: true }),
                    responses: {
                        200: z.object({
                            message: z.literal(
                                "Workspace updated successfully"
                            ),
                        }),
                        400: z.object({
                            error: z.literal("Invalid input"),
                            reason: z.string().min(1),
                        }),
                    },
                    summary: "Update a workspace by id",
                },
                deleteWorkspace: {
                    method: "POST",
                    path: "/delete",
                    body: z.any(),
                    responses: {
                        200: z.object({
                            message: z.literal(
                                "Workspace deleted successfully"
                            ),
                        }),
                    },
                    summary: "Delete a workspace by id",
                },
                accounts: accountsContract,
                categories: categoriesContract,
                transactions: transactionsContract,
            },
            {
                pathPrefix: "/:workspaceId",
                pathParams: Budgeting$WorkspaceSchema.pick({
                    workspaceId: true,
                }),
                commonResponses: {
                    404: z.object({
                        error: z.literal("Workspace does not exist"),
                    }),
                },
            }
        ),
    },
    {
        pathPrefix: "/workspaces",
    }
);

export default workspacesContract;
