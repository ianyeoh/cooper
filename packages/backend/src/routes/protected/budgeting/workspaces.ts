import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../../middleware/authenticate";
import { validateWorkspace } from "../../../middleware/validateWorkspace";

const getWorkspacesHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.getWorkspaces
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const userWorkspaces = db.budgeting.workspaces.getUserWorkspaces(
        res.session.username
    );

    return {
        status: 200,
        body: userWorkspaces,
    };
};
export const getWorkspaces = {
    middleware: [authenticate],
    handler: getWorkspacesHandler,
};

const newWorkspaceHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.newWorkspace
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const newWorkspace = db.budgeting.workspaces.createWorkspace(
        res.session.username
    );

    if (newWorkspace instanceof Error)
        return {
            status: 500,
            body: {
                error: "Failed to create workspace, please try again later",
            },
        };
};

export const newWorkspace = {
    middleware: [authenticate],
    handler: newWorkspaceHandler,
};
