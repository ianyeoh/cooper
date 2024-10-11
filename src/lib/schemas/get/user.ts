import { z } from "zod";

export const userProfileSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});
export type UserProfileType = z.infer<typeof userProfileSchema>;
