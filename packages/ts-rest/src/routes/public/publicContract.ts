import { initContract } from "@ts-rest/core";
import authContract from "./authContract";

const c = initContract();

/*
 * All routes in this contract are public (not protected by authenticatiopn)
 */
const publicContract = c.router(
    {
        auth: authContract,
    },
    {
        pathPrefix: "/",
    }
);

export default publicContract;
