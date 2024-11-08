import { AppRouteImplementation } from "@ts-rest/express";
import { z } from "zod";
import BudgetTransaction from "../db/budgetTransaction";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";

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
