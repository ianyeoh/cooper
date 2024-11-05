import { z } from "zod";
import { authedProcedure, t } from "../trpc.ts";
import Session from "../db/sessions.ts";
import { TRPCError } from "@trpc/server";

export const usersRouter = t.router({
    session: authedProcedure
        .output(
            z.object({
                username: z.string().min(1),
            })
        )
        .query(async ({ ctx }) => {
            const session = await Session.findOne({ _id: ctx.sessionId });

            if (!session) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Session not found.",
                });
            }

            return { username: session.username };
        }),
});

// export type definition of API
export type UsersRouter = typeof usersRouter;
export default usersRouter;
