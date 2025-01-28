import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Auth$User } from "../../types";

const c = initContract();

const usersContract = c.router(
    {
        getUser: {
            method: "GET",
            path: "/:username",
            responses: {
                200: c.type<Omit<Auth$User, "password">>(),
                401: z.object({
                    error: z.literal("Unauthorised"),
                }),
            },
            summary: "Get user profile data",
        },
    },
    {
        pathPrefix: "/users",
        pathParams: z.object({
            username: z.string().min(1).max(50),
        }),
        commonResponses: {
            400: z.object({
                error: z.literal("Invalid username"),
                reason: z.string().min(1),
            }),
        },
    }
);

export default usersContract;
