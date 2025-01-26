// Sentry (error logging) instrumentation, must be imported first
import "./instrument";
import * as Sentry from "@sentry/node";

// All other imports
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import mongoose from "mongoose";
import process from "node:process";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "@cooper/ts-rest/src/contract";
import { serve, setup } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { login, logout, signup, session } from "./routes/auth";
import { getAccounts, newAccount } from "./routes/accounts";
import { getUserProfile } from "./routes/users";
import { getTransactions, newTransaction } from "./routes/transactions";
import { status } from "./routes/status";
import serverConfig from "../serverConfig.json";
import InMemoryDatabase from "./database/in-memory/database";

// Get configuration variables from environment
const hostname = serverConfig.hostname;
const port = serverConfig.port;

config(); // Load variables from .env file into process.env
// const mongoURL = process.env.MONGO_URL;
// const mongoDB = process.env.MONGO_DB;

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
app.use(
    morgan(
        "[server]: :method :url :status :res[content-length] - :response-time ms"
    )
);
app.use(cookieParser());
app.use(express.json());

// Initialise and mount ts-rest router
const s = initServer();
const router = s.router(contract, {
    status,
    auth: {
        login,
        logout,
        signup,
        session,
    },
    budgeting: {
        transactions: {
            getTransactions,
            newTransaction,
        },
        accounts: {
            getAccounts,
            newAccount,
        },
    },
    users: {
        getUserProfile,
    },
});
createExpressEndpoints(contract, router, app, {
    responseValidation: true,
});

// Auto-generated Swagger API docs
const openapi = generateOpenApi(contract, {
    info: { title: "API Documentation", version: "1.0.0" },
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

// Check if MongoDB connection string is set
// if (mongoURL == null) {
//     console.log(
//         `[server]: No MongoDB connection string set in environment or .env file`
//     );
//     throw new Error("Missing MONGO_URL environment variable");
// }

app.locals.database = new InMemoryDatabase();

// Start server
app.listen(port, hostname, () => {
    console.log(`[server]: Server is running at http://${hostname}:${port}`);
    console.log(
        `[server]: API documentation is available at http://${hostname}:${port}/docs`
    );
});
