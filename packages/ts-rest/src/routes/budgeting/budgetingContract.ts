import { initContract } from "@ts-rest/core";
import { z } from "zod";
import transactionsContract from "./transactionsContract";
import accountsContract from "./accountsContract";

const c = initContract();

/**
 * The main contract for budgeting app
 */
const budgetingContract = c.router(
    {
        transactions: transactionsContract,
        accounts: accountsContract,
    },
    {
        pathPrefix: "/budgeting",
    }
);
export type ContractType = typeof budgetingContract;
export default budgetingContract;
