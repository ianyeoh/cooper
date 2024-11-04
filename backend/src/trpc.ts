import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC, TRPCError } from "@trpc/server";
import Session from "./db/sessions.ts";

// tRPC setup
export const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
    return {
        req,
        res,
    };
};
type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

// tRPC base procedures
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(async function isAuthed({
    ctx,
    next,
}) {
    const sessionId = ctx.req.cookies.id;

    if (!sessionId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Request is unauthenticated.",
        });
    }

    const validSession = await Session.findById(sessionId);
    if (!validSession) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Request is unauthenticated.",
        });
    }

    return next({
        ctx: {
            sessionId,
        },
    });
});
