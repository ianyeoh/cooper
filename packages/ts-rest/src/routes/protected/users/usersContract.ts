import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Auth$UserSchema } from "@cooper/ts-rest/src/types";

const c = initContract();

const usersContract = c.router(
  {
    getSelf: {
      method: "GET",
      path: "/self",
      responses: {
        200: z.object({
          user: Auth$UserSchema.pick({
            username: true,
            firstName: true,
            lastName: true,
          }),
        }),
        401: z.object({
          error: z.literal("Unauthorised"),
        }),
      },
      summary: "Get self user profile data",
    },
    getUser: {
      method: "GET",
      path: "/:username",
      responses: {
        200: z.object({
          user: Auth$UserSchema.pick({
            username: true,
            firstName: true,
            lastName: true,
          }),
        }),
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
      }),
    },
  },
);

export default usersContract;
