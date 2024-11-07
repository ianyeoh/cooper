import { AppRouteImplementation } from "@ts-rest/express";
import { z } from "zod";
import BudgetTransaction from "../db/budgetTransaction.ts";
import { contract } from "../../../ts-rest/contract.ts";
import { authed } from "../middleware/authed.ts";

const getTransactionsHandler: AppRouteImplementation<
    typeof contract.transactions.getTransactions
> = async function () {
    const records = await BudgetTransaction.find().exec();
    return {
        status: 200,
        body: {
            records,
        },
    };
};

export const getTransactions = {
    middleware: [authed],
    handler: getTransactionsHandler,
};
