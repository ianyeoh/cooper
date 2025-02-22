import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "@cooper/backend/src/middleware/authenticate";
import { validateWorkspace } from "@cooper/backend/src/middleware/validateWorkspace";
import { validateAccount } from "@cooper/backend/src/middleware/validateAccount";
import guard from "@cooper/backend/src/middleware/guard";

const getAccountsHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.accounts.getAccounts
> = async function ({ req, res }) {
    const db = req.app.locals.database;
    const workspaceId = guard(res.workspace).workspaceId;

    const accounts = db.budgeting.accounts.getWorkspaceAccounts(workspaceId);

    return {
        status: 200,
        body: {
            accounts,
        },
    };
};
export const getAccounts = {
    middleware: [authenticate, validateWorkspace],
    handler: getAccountsHandler,
};

const newAccountHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.accounts.newAccount
> = async function ({ req, res, body }) {
    const db = req.app.locals.database;
    const workspaceId = guard(res.workspace).workspaceId;

    const { description, name, bank, createdBy } = body;

    const newAccount = db.budgeting.accounts.createAccount(
        name,
        bank,
        description,
        workspaceId,
        createdBy
    );

    if (newAccount instanceof Error) {
        throw newAccount;
    }

    return {
        status: 200,
        body: {
            message: "Account created successfully",
        },
    };
};
export const newAccount = {
    middleware: [authenticate, validateWorkspace],
    handler: newAccountHandler,
};

const updateAccountHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.accounts.byId.updateAccount
> = async function ({ req, res, body }) {
    const db = req.app.locals.database;

    const accountId = guard(res.account).accountId;
    const { description, name, bank, createdBy } = body;

    const updatedAccount = db.budgeting.accounts.updateAccount(
        accountId,
        name,
        bank,
        description,
        createdBy
    );

    if (updatedAccount instanceof Error) {
        throw updatedAccount;
    }

    return {
        status: 200,
        body: {
            message: "Account updated successfully",
        },
    };
};
export const updateAccount = {
    middleware: [authenticate, validateWorkspace, validateAccount],
    handler: updateAccountHandler,
};

const deleteAccountHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.byId.accounts.byId.deleteAccount
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const accountId = guard(res.account).accountId;

    db.budgeting.accounts.deleteAccount(accountId);

    return {
        status: 200,
        body: {
            message: "Account deleted successfully",
        },
    };
};
export const deleteAccount = {
    middleware: [authenticate, validateWorkspace, validateAccount],
    handler: deleteAccountHandler,
};
