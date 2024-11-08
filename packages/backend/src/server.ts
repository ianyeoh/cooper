// Sentry (error logging) instrumentation, must be imported first
import "./instrument";
import * as Sentry from "@sentry/node";

// All other imports
import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import process from "node:process";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "@cooper/ts-rest/src/contract";
import { serve, setup } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { login, logout, signup } from "./routes/auth";
import { getUserProfile } from "./routes/users";
import { getTransactions } from "./routes/transactions";
import { status } from "./routes/status";

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
    info: { title: "API Documentation", version: "1.0.0" },
});

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
