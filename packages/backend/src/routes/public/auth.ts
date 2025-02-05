import { AppRouteImplementation } from "@ts-rest/express";
import { compareSaltedHash, saltedHash } from "../../lib/hashing";
import { addMinutes } from "date-fns";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../middleware/authenticate";

export const login: AppRouteImplementation<typeof contract.public.auth.login> =
    async function ({ body, req, res }) {
        const db = req.app.locals.database;

        // Check if valid user
        const existingUser = db.auth.users.getUser(body.username);
        if (!existingUser)
            return {
                status: 401,
                body: {
                    error: "Invalid username or password",
                },
            };

        // Check if username and password match
        const passwordMatch = compareSaltedHash(
            body.password,
            existingUser.password
        );
        if (!passwordMatch)
            return {
                status: 401,
                body: {
                    error: "Invalid username or password",
                },
            };

        // Get session details
        const ip = req.ip ?? "Unknown";
        const userAgent = req.get("user-agent") || "Unknown";

        const newSession = db.auth.sessions.createSession(
            existingUser.username,
            ip,
            userAgent,
            new Date(),
            addMinutes(new Date(), 30)
        );

        // Unexpected error here - there was an issue with the database layer
        if (newSession instanceof Error)
            return {
                status: 500,
                body: {
                    error: "Failed to create session, please try again later",
                },
            };

        // Set secure httpOnly cookie with new session tied to user
        res.cookie("id", newSession.sessionId, {
            secure: true,
            expires: newSession.expires,
            httpOnly: true,
            sameSite: "strict",
        });

        return {
            status: 200,
            body: {
                message: "Logged in successfully",
            },
        };
    };

export const logout: AppRouteImplementation<
    typeof contract.public.auth.logout
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const sessionId = res.session.sessionId;
    if (sessionId != null) {
        db.auth.sessions.deleteSession(sessionId);
        res.clearCookie("id");
    }

    return {
        status: 200,
        body: {
            message: "Logged out successfully",
        },
    };
};

export const signup: AppRouteImplementation<
    typeof contract.public.auth.signup
> = async function ({ req, body }) {
    const db = req.app.locals.database;

    const existingUser = db.auth.users.getUser(body.username);

    if (existingUser)
        return {
            status: 400,
            body: {
                error: "User already exists",
            },
        };

    const newUser = db.auth.users.createUser({
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        password: saltedHash(body.password),
    });

    if (newUser instanceof Error)
        return {
            status: 500,
            body: {
                error: "Failed to create user, please try again later",
            },
        };

    return {
        status: 200,
        body: {
            message: "Signed up successfully",
        },
    };
};

const sessionHandler: AppRouteImplementation<
    typeof contract.public.auth.validSession
> = async function () {
    // "authed" middleware validates session beforehand, so always return success
    return {
        status: 200,
        body: {
            message: "Valid session",
        },
    };
};
export const session = {
    middleware: [authenticate],
    handler: sessionHandler,
};
