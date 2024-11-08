import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@cooper/ts-rest/";
import "@/lib/envConfig";

export const tsr = initTsrReactQuery(contract, {
    baseUrl: process.env.BACKEND_URL ?? "http://localhost:3000/api",
    baseHeaders: {
        "x-app-source": "ts-rest",
    },
    credentials: "include", // for our cookie based sessions
});
