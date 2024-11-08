import { AppRouteImplementation } from "@ts-rest/express";
import Session from "../db/sessions";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";

const getUserProfileHandler: AppRouteImplementation<
    typeof contract.users.getUserProfile
> = async function ({ res }) {
    const session = await Session.findOne({ _id: res.sessionId });

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
