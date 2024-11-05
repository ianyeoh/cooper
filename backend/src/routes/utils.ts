import { z } from "zod";
import { publicProcedure, t } from "../trpc.ts";
import mongoose from "mongoose";

export const utilsRouter = t.router({
    heartbeat: publicProcedure
        .output(
            z.object({
                database: z.string().min(1),
            })
        )
        .query(() => {
            let dbState: string;
            switch (mongoose.connection.readyState) {
                case mongoose.ConnectionStates.disconnected:
                    dbState = "DISCONNECTED";
                    break;
                case mongoose.ConnectionStates.connected:
                    dbState = "CONNECTED";
                    break;
                case mongoose.ConnectionStates.connecting:
                    dbState = "CONNECTING";
                    break;
                case mongoose.ConnectionStates.disconnecting:
                    dbState = "DISCONNECTING";
                    break;
                case mongoose.ConnectionStates.uninitialized:
                    dbState = "UNINITIALISED";
                    break;
            }

            return {
                database: dbState,
            };
        }),
});

// export type definition of API
export type UtilsRouter = typeof utilsRouter;
export default utilsRouter;
