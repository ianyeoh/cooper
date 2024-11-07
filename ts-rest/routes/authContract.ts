import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const authContract = c.router({
    login: {
        method: "POST",
        path: "/auth/login",
        body: z.object({
            username: z.string().min(2),
            password: z.string().min(2),
        }),
        responses: {
            200: z.object({
                message: z.literal("Logged in successfully"),
            }),
            401: z.object({
                error: z.literal("Login unauthorised"),
            }),
        },
        summary: "Log in with username and password",
    },
    logout: {
        method: "GET",
        path: "/auth/logout",
        responses: {
            200: z.object({
                message: z.literal("Logged out successfully"),
            }),
        },
        summary: "Log out of session",
    },
    signup: {
        method: "POST",
        path: "/auth/signup",
        body: z.object({
            username: z.string().min(2),
            password: z.string().min(2),
        }),
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
});

export default authContract;
