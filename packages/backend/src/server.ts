// Sentry (error logging) instrumentation, must be imported first
import "@cooper/backend/src/instrument";
import * as Sentry from "@sentry/node";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import {
    consoleLogger,
    activityLogger,
    logger,
} from "@cooper/backend/src/logging";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { serve, setup } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import openapi from "@cooper/backend/src/openapi";
import InMemoryDatabase from "@cooper/backend/src/database/in-memory/database";

import { getSelf, getUser } from "@cooper/backend/src/routes/protected/users";
import {
    getTransactions,
    newTransaction,
    updateTransaction,
    deleteTransaction,
} from "@cooper/backend/src/routes/protected/budgeting/transactions";
import {
    getAccounts,
    newAccount,
    updateAccount,
    deleteAccount,
} from "@cooper/backend/src/routes/protected/budgeting/accounts";
import {
    getWorkspaces,
    newWorkspace,
    updateWorkspace,
    deleteWorkspace,
} from "@cooper/backend/src/routes/protected/budgeting/workspaces";
import {
    getCategories,
    newCategory,
    updateCategory,
    deleteCategory,
} from "@cooper/backend/src/routes/protected/budgeting/categories";
import {
    login,
    logout,
    signup,
    getSessions,
    validSession,
} from "@cooper/backend/src/routes/public/auth";

/**
 * Express initialisation
 */
const app = express();

// Express middleware and route handlers
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(consoleLogger);
app.use(activityLogger);
app.use(cookieParser());
app.use(express.json());

// Initialise and mount ts-rest router
const s = initServer();

// Ignore type instantiation is excessively deep and possibly infinite error (T2589)
// @ts-ignore
const router = s.router(contract, {
    protected: {
        users: {
            getSelf,
            getUser,
        },
        budgeting: {
            workspaces: {
                getWorkspaces,
                newWorkspace,
                byId: {
                    updateWorkspace,
                    deleteWorkspace,
                    accounts: {
                        getAccounts,
                        newAccount,
                        byId: {
                            updateAccount,
                            deleteAccount,
                        },
                    },
                    categories: {
                        getCategories,
                        newCategory,
                        byId: {
                            updateCategory,
                            deleteCategory,
                        },
                    },
                    transactions: {
                        getTransactions,
                        newTransaction,
                        byId: {
                            updateTransaction,
                            deleteTransaction,
                        },
                    },
                },
            },
        },
    },
    public: {
        auth: {
            login,
            logout,
            signup,
            validSession,
            getSessions,
        },
    },
});
createExpressEndpoints(contract, router, app, {
    responseValidation: true,
});

// Serve API docs at /docs
const apiDocs = express.Router();
apiDocs.use(serve);
apiDocs.get(
    "/",
    setup(openapi, {
        customCssUrl: "/static/theme-flattop.css",
    })
);
app.use("/docs", apiDocs);

// Serve static files from /public directory
app.use(express.static("public"));

// The Sentry error handler must be registered before any other error middleware but after all routers
Sentry.setupExpressErrorHandler(app);

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    if (req.body) {
        logger.error(req.body);
    }

    if (err instanceof Error) {
        logger.error(
            `${err.name} - ${err.cause} - ${err.message} - ${err.stack}`
        );
    }

    res.status(500).json({
        error: "Unexpected server error. Please try again later.",
    });
    return;
});

app.locals.database = new InMemoryDatabase({
    initialUsers: new Map([
        [
            "ianyeoh",
            {
                username: "ianyeoh",
                firstName: "Ian",
                lastName: "Yeoh",
                // hard-coded hash value of asd, for testing
                password:
                    "$2a$10$C/5nLYy.wjdrIGcQmKxiZ.OcQ9aQephzCTb10RVBvyzfKveYHJQoi",
            },
        ],
    ]),
});

export default app;
