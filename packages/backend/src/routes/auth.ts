import { AppRouteImplementation } from "@ts-rest/express";
import { compareSaltedHash, saltedHash } from "../lib/hashing";
import { addMinutes } from "date-fns";
import Session from "../db/session";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";
import Authentication from "../db/authentication";
import User from "../db/user";

export const login: AppRouteImplementation<typeof contract.auth.login> =
    async function ({ body, req, res }) {
        const existingUser = await Authentication.findOne({
            username: body.username,
        }).exec();

        if (!existingUser) {
            return {
                status: 401,
                body: {
                    error: "Invalid username or password",
                },
            };
        }

        const passwordMatch = compareSaltedHash(
            body.password,
            existingUser.password
        );

        if (!passwordMatch) {
            return {
                status: 401,
                body: {
                    error: "Invalid username or password",
                },
            };
        }

        const ip = req.ip ?? "Unknown";
        const userAgent = req.get("user-agent");

        const session = new Session({
            user: existingUser.user,
            ip,
            userAgent,
            started: new Date(),
            expires: addMinutes(new Date(), 30),
        });
        await session.save();

        res.cookie("id", session.id, {
            secure: true,
            expires: session.expires,
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

const logoutHandler: AppRouteImplementation<typeof contract.auth.logout> =
    async function ({ res }) {
        if (res.sessionId) {
            await Session.findByIdAndDelete(res.sessionId);
            res.clearCookie("id");
        }
        return {
            status: 200,
            body: {
                message: "Logged out successfully",
            },
        };
    };
export const logout = {
    middleware: [authed],
    handler: logoutHandler,
};

export const signup: AppRouteImplementation<typeof contract.auth.signup> =
    async function ({ body }) {
        const existingUser = await Authentication.findOne({
            username: body.username,
        }).exec();

        if (existingUser) {
            return {
                status: 400,
                body: {
                    error: "User already exists",
                },
            };
        }

        const newUser = await User.create({
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            roles: [], // assign default roles here
        });

        await Authentication.create({
            username: body.username,
            user: newUser._id,
            password: saltedHash(body.password),
        });

        return {
            status: 200,
            body: {
                message: "Signed up successfully",
            },
        };
    };

const sessionHandler: AppRouteImplementation<typeof contract.auth.session> =
    async function () {
        return {
            status: 200,
            body: {
                message: "Valid session",
            },
        };
    };
export const session = {
    middleware: [authed],
    handler: sessionHandler,
};
