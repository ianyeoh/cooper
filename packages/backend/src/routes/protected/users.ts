import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../middleware/authenticate";
import guard from "@cooper/backend/src/middleware/guard";

const getSelfHandler: AppRouteImplementation<
    typeof contract.protected.users.getSelf
> = async function ({ req, res }) {
    const db = req.app.locals.database;
    const user = db.auth.users.getUser(guard(res.session).username);

    if (!user) {
        throw user;
    }

    return {
        status: 200,
        body: {
            user,
        },
    };
};
export const getSelf = {
    middleware: [authenticate],
    handler: getSelfHandler,
};

const getUserHandler: AppRouteImplementation<
    typeof contract.protected.users.getUser
> = async function ({ req }) {
    const db = req.app.locals.database;

    const user = db.auth.users.getUser(req.params.username);

    if (!user) {
        return {
            status: 400,
            body: {
                error: "Invalid username",
            },
        };
    }

    return {
        status: 200,
        body: {
            user,
        },
    };
};
export const getUser = {
    middleware: [authenticate],
    handler: getUserHandler,
};
