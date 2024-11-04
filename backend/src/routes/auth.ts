import z from "zod";
import { authedProcedure, publicProcedure, t } from "../trpc.ts";
import { compareSaltedHash } from "../lib/hashing.ts";
import { TRPCError } from "@trpc/server";
import { addMinutes } from "date-fns";
import User from "../db/users.ts";
import Session from "../db/sessions.ts";

export const authRouter = t.router({
    login: publicProcedure
        .input(
            z.object({
                username: z.string().min(2),
                password: z.string().min(2),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const existingUser = await User.findOne({
                username: input.username,
            }).exec();

            if (!existingUser) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password.",
                });
            }

            const passwordMatch = compareSaltedHash(
                input.password,
                existingUser.password
            );

            if (!passwordMatch) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password.",
                });
            }

            const ip = ctx.req.ip ?? "Unknown";
            const userAgent = ctx.req.get("user-agent");

            const session = new Session({
                username: input.username,
                ip,
                userAgent,
                started: new Date(),
                expires: addMinutes(new Date(), 30),
            });

            await session.save();

            ctx.res.cookie("id", session.id, {
                secure: true,
                expires: session.expires,
                httpOnly: true,
                sameSite: "strict",
            });

            return;
        }),
    logout: authedProcedure.query(async ({ ctx }) => {
        await Session.findByIdAndDelete(ctx.sessionId.value);
        ctx.res.clearCookie("id");
        return;
    }),
});

// export type definition of API
export type AppRouter = typeof authRouter;
export default authRouter;
