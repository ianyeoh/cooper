import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const usersContract = c.router(
    {
        getUserProfile: {
            method: "GET",
            path: "/profile",
            responses: {
                200: z.object({
                    username: z.string().min(1),
                    firstName: z.string().min(1),
                    lastName: z.string().min(1),
                    roles: z.array(z.string().min(1)),
                }),
                401: z.object({
                    error: z.literal("Unauthorised"),
                }),
            },
            summary: "Get user profile",
        },
    },
    {
        commonResponses: {
            401: z.object({
                error: z.literal("Unauthorised"),
            }),
        },
        pathPrefix: "/users",
    }
);

export default usersContract;
