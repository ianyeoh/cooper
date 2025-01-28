import { initContract } from "@ts-rest/core";
import workspacesContract from "./workspacesContract";

const c = initContract();

/**
 * The main contract for budgeting app
 */
const budgetingContract = c.router(
    {
        workspaces: workspacesContract,
    },
    {
        pathPrefix: "/budgeting",
    }
);
export type ContractType = typeof budgetingContract;
export default budgetingContract;
