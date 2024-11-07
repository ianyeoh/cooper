import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const usersContract = c.router({
    getUserProfile: {
        method: "GET",
        path: "/userProfile",
        responses: {
            200: z.object({
                username: z.string().min(1),
            }),
        },
        summary: "Get user profile",
    },
});

export default usersContract;
