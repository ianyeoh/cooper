import { AppRouteImplementation } from "@ts-rest/express";
import Session from "../db/session";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";
import { UserType } from "../db/user";

const getUserProfileHandler: AppRouteImplementation<
    typeof contract.users.getUserProfile
> = async function ({ res }) {
    const session = await Session.findById(res.sessionId)
        .populate<{ user: UserType }>({
            path: "user",
            select: ["username", "firstName", "lastName", "roles"],
        })
        .exec();

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
        body: session.user,
    };
};
export const getUserProfile = {
    middleware: [authed],
    handler: getUserProfileHandler,
};
