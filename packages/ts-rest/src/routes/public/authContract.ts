import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Auth$Session, Auth$UserSchema } from "../../types";

const c = initContract();

const authContract = c.router(
    {
        login: {
            method: "POST",
            path: "/login",
            body: Auth$UserSchema.pick({ username: true, password: true }),
            responses: {
                200: z.object({
                    message: z.literal("Logged in successfully"),
                }),
                400: z.object({
                    error: z.literal("Already logged in"),
                }),
                401: z.object({
                    error: z.literal("Invalid username or password"),
                }),
            },
            summary: "Log in with username and password",
        },
        logout: {
            method: "POST",
            path: "/logout",
            body: z.any(),
            responses: {
                200: z.object({
                    message: z.literal("Logged out successfully"),
                }),
                401: z.object({
                    error: z.literal("Unauthorised"),
                }),
            },
            summary: "Log out of session",
        },
        signup: {
            method: "POST",
            path: "/signup",
            body: Auth$UserSchema,
            responses: {
                200: z.object({
                    message: z.literal("Signed up successfully"),
                }),
                400: z.object({
                    error: z.literal("User already exists"),
                }),
            },
            summary: "Sign up as new user",
        },
        getSessions: {
            method: "GET",
            path: "/sessions",
            responses: {
                200: c.type<Auth$Session>(),
            },
        },
        validSession: {
            method: "GET",
            path: "/sessions/validate",
            responses: {
                200: z.object({
                    message: z.literal("Valid session"),
                }),
                401: z.object({
                    error: z.literal("Unauthorised"),
                }),
            },
            summary: "Check if valid session",
        },
    },
    {
        pathPrefix: "/auth",
    }
);

export default authContract;
