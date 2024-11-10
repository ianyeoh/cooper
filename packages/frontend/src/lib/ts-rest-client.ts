import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@cooper/ts-rest/src/contract";

/**
 * React Query client with ts-rest typing for full TypeScript
 * annotation as set in the API contract in @cooper/ts-rest package.
 *
 * Use for client side backend API calls (e.g. client components)
 */
export const tsr = initTsrReactQuery(contract, {
    baseUrl: "", // the Next.js server (from client)
    credentials: "include", // for our cookie based sessions
});
