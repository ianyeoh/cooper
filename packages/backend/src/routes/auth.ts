import { AppRouteImplementation } from "@ts-rest/express";
import { compareSaltedHash, saltedHash } from "../lib/hashing";
import { addMinutes } from "date-fns";
import User from "../db/users";
import Session from "../db/sessions";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";

export const login: AppRouteImplementation<typeof contract.auth.login> =
    async function ({ body, req, res }) {
        const existingUser = await User.findOne({
            username: body.username,
        }).exec();

        if (!existingUser) {
            return {
                status: 401,
                body: {
                    error: "Login unauthorised",
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
                    error: "Login unauthorised",
                },
            };
        }

        const ip = req.ip ?? "Unknown";
        const userAgent = req.get("user-agent");

        const session = new Session({
            username: body.username,
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
        const existingUser = await User.findOne({
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

        await User.create({
            username: body.username,
            password: saltedHash(body.password),
        });

        return {
            status: 200,
            body: {
                message: "Signed up successfully",
            },
        };
    };
