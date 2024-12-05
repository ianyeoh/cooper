import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const authContract = c.router(
    {
        login: {
            method: "POST",
            path: "/login",
            body: z.object({
                username: z.string().min(2),
                password: z.string().min(2),
            }),
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
            body: z.object({}),
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
            body: z.object({
                firstName: z.string().min(2),
                lastName: z.string().min(2),
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
        session: {
            method: "GET",
            path: "/session",
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
