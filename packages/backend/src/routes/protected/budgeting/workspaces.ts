import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "@cooper/backend/src/middleware/authenticate";
import { validateWorkspace } from "@cooper/backend/src/middleware/validateWorkspace";
import guard from "@cooper/backend/src/middleware/guard";


const getWorkspacesHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.getWorkspaces
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const workspaces = db.budgeting.workspaces.getUserWorkspaces(
        guard(res.session).username
    );

    return {
        status: 200,
        body: {
            workspaces,
        },
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
        guard(res.session).username
    );

    if (newWorkspace instanceof Error) {
        throw newWorkspace;
    }

    return {
        status: 200,
        body: {
            message: "Workspace created successfully",
        },
    };
};
export const newWorkspace = {
    middleware: [authenticate],
    handler: newWorkspaceHandler,
};

const updateWorkspaceHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.updateWorkspace
> = async function ({ req, res, body }) {
    const db = req.app.locals.database;
    const workspaceId = guard(res.workspace).workspaceId;

    const updatedWorkspace = db.budgeting.workspaces.updateWorkspace(
        workspaceId,
        body.users
    );

    if (updatedWorkspace instanceof Error) {
        throw updatedWorkspace;
    }

    return {
        status: 200,
        body: {
            message: "Workspace updated successfully",
        },
    };
};
export const updateWorkspace = {
    middleware: [authenticate, validateWorkspace],
    handler: updateWorkspaceHandler,
};

const deleteWorkspaceHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.deleteWorkspace
> = async function ({ req, res }) {
    const db = req.app.locals.database;
    const workspaceId = guard(res.workspace).workspaceId;

    db.budgeting.workspaces.deleteWorkspace(workspaceId);

    return {
        status: 200,
        body: {
            message: "Workspace deleted successfully",
        },
    };
};
export const deleteWorkspace = {
    middleware: [authenticate, validateWorkspace],
    handler: deleteWorkspaceHandler,
};
