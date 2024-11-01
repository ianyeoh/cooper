// Must be imported first
import "./instrument.mjs";
import * as Sentry from "@sentry/node";

// Other imports
import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import docsRouter from "./docs.mjs";
import authRouter from "./routes/auth.mjs";

// Derive configuration variables from environment
config(); // Load variables from .env file into process.env
const env = process.env.ENV === "development" ? process.env.ENV : "production";
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;
const mongoDB = process.env.MONGO_DB;

const app = express();

// Middleware and route handlers
app.use(express.json());
app.use("/docs", docsRouter);
app.use("/auth", authRouter);

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

// Server startup sequence
console.log(`[server]: Running in ${env} mode`);

if (mongoURL == null) {
    console.log(
        `[server]: No MongoDB connection string set in environment or .env file`
    );
    throw new Error("Missing MONGO_URL environment variable");
}

console.log(`[server]: Attempting to connect to MongoDB...`);
if (mongoDB == null) {
    console.log(
        `[server]: Database name not specified in environment, defaulting to "cooper"`
    );
}

mongoose
    .connect(mongoURL, {
        dbName: mongoDB || "cooper",
    })
    .then(() => {
        console.log(
            `[server]: Connected to MongoDB successfully, starting server...`
        );

        app.listen(port, () => {
            console.log(
                `[server]: Server is running at http://localhost:${port}`
            );

            if (env === "development") {
                console.log(`[server]: API documentation is hosted at /docs/`);
            }
        });
    })
    .catch((err) => {
        console.log(`[server]: Failed to connect to MongoDB: ${err}`);
    });
