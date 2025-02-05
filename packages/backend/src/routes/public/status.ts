import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";

export const status: AppRouteImplementation<
    typeof contract.status
> = async () => {
    return {
        status: 200,
        body: {
            database: "CONNECTED",
        },
    };
};
