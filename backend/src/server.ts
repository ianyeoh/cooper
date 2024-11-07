// Sentry (error logging) instrumentation, must be imported first
import "./instrument.ts";
import * as Sentry from "@sentry/node";

// All other imports
import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import process from "node:process";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "../../ts-rest/contract.ts";
import { serve, setup } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { login, logout, signup } from "./routes/auth.ts";
import { getUserProfile } from "./routes/users.ts";
import { getTransactions } from "./routes/transactions.ts";
import { status } from "./routes/status.ts";

// Get configuration variables from environment
config(); // Load variables from .env file into process.env
const env = process.env.ENV === "development" ? process.env.ENV : "production";
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
const mongoDB = process.env.MONGO_DB;

/**
 * Express initialisation
 */
const app = express();

// Express middleware and route handlers
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
    },
    transactions: {
        getTransactions,
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
    info: { title: "Play API", version: "0.1" },
});

const apiDocs = express.Router();
apiDocs.use(serve);
apiDocs.get("/", setup(openapi));
app.use("/docs", apiDocs);

// The Sentry error handler must be registered before any other error middleware but after all routers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(
    _err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

/**
 * Server startup sequence
 */
console.log(`[server]: Running in ${env} mode`);

// Check if MongoDB connection string is set
if (mongoURL == null) {
    console.log(
        `[server]: No MongoDB connection string set in environment or .env file`
    );
    throw new Error("Missing MONGO_URL environment variable");
}

// Default MongoDB database name if not set
console.log(`[server]: Attempting to connect to MongoDB...`);
if (mongoDB == null) {
    console.log(
        `[server]: Database name not specified in environment, defaulting to "cooper"`
    );
}

// Connect with Mongoose client
mongoose
    .connect(mongoURL, {
        dbName: mongoDB || "cooper",
    })
    .then(() => {
        console.log(
            `[server]: Connected to MongoDB successfully, starting server...`
        );

        // Start server
        app.listen(port, () => {
            console.log(
                `[server]: Server is running at http://localhost:${port}`
            );
        });
    })
    .catch((err: Error) => {
        console.log(`[server]: Failed to connect to MongoDB: ${err}`);
    });
