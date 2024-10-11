import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
});
export type LoginType = z.infer<typeof loginSchema>;

export const signupSchema = z
    .object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 2 characters.",
        }),
        confirmPassword: z.string().min(2, {
            message: "Confirm password be at least 2 characters.",
        }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Password and confirm password must match.",
                path: ["confirmPassword"],
            });
        }
    });
export type SignupType = z.infer<typeof signupSchema>;

export const sessionSchema = z.object({
    sessionId: z.string().min(1, {
        message: "Session must not be empty.",
    }),
});
export type SessionType = z.infer<typeof sessionSchema>;
