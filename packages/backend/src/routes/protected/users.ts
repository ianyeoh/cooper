import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../middleware/authenticate";

const getUserProfileHandler: AppRouteImplementation<
    typeof contract.protected.users.getUser
> = async function ({ req, res }) {
    const db = req.app.locals.database;

    const user = db.auth.users.getUser(res.session.username);

    if (!user) {
        return {
            status: 401,
            body: {
                error: "Unauthorised",
            },
        };
    }

    return {
        status: 200,
        body: user,
    };
};
export const getUserProfile = {
    middleware: [authenticate],
    handler: getUserProfileHandler,
};
