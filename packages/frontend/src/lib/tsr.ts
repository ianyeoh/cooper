import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@cooper/ts-rest/src/contract";
import { initClient } from "@ts-rest/core";

export const tsr = initTsrReactQuery(contract, {
    baseUrl: "/api",
    credentials: "include", // for our cookie based sessions
});

export const fetch = initClient(contract, {
    baseUrl: "/api",
    credentials: "include", // for our cookie based sessions
});
