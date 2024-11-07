import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "../../../ts-rest/contract.ts";
import mongoose from "mongoose";

export const status: AppRouteImplementation<typeof contract.status> = async () => {
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
        status: 200,
        body: {
            database: dbState,
        },
    };
};
