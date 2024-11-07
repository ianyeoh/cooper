// Sentry (error logging) instrumentation, must be imported first
import "./instrument.ts";
import * as Sentry from "@sentry/node";

// All other imports
import * as trpcExpress from "@trpc/server/adapters/express";
import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import process from "node:process";
import { createContext, t } from "./trpc.ts";
import authRouter from "./routes/auth.ts";
import utilsRouter from "./routes/utils.ts";
import usersRouter from "./routes/users.ts";

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
const appRouter = t.router({
    auth: authRouter,
    utils: utilsRouter,
    user: usersRouter,
});

// Express middleware and route handlers
app.use(express.json());
app.use(
    "/api",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
); // tRPC route handler

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


// Export only the type of our app router for tRPC on the client
export type AppRouter = typeof appRouter;
