import { AppRouteImplementation } from "@ts-rest/express";
import Session from "../db/sessions.ts";
import { contract } from "../../../ts-rest/contract.ts";
import { authed } from "../middleware/authed.ts";

const getUserProfileHandler: AppRouteImplementation<
    typeof contract.users.getUserProfile
> = async function ({ req }) {
    const session = await Session.findOne({ _id: req.sessionId });

    if (!session) {
        return {
            status: 401,
            body: {
                error: "Unauthorised",
            },
        };
    }

    return {
        status: 200,
        body: {
            username: session.username,
        },
    };
};
export const getUserProfile = {
    middleware: [authed],
    handler: getUserProfileHandler,
};
