import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../../middleware/authenticate";

const getTransactionsHandler: AppRouteImplementation<
    typeof contract.budgeting.transactions.getTransactions
> = async function () {
    const records = await BudgetTransaction.find()
        .populate<{
            account: BudgetAccountType;
        }>({
            path: "account",
            select: ["name", "bank"],
        })
        .populate<{
            category: BudgetCategoryType;
        }>({ path: "category", select: ["name"] })
        .populate<{
            createdBy: UserType;
        }>({
            path: "createdBy",
            select: ["firstName", "lastName"],
        })
        .exec();

    return {
        status: 200,
        body: {
            records,
        },
    };
};
export const getTransactions = {
    middleware: [authenticate],
    handler: getTransactionsHandler,
};

const newTransactionHandler: AppRouteImplementation<
    typeof contract.budgeting.transactions.newTransaction
> = async function ({ res, body }) {
    if (!(await BudgetAccount.findById(body.accountId))) {
        return {
            status: 400,
            body: {
                error: "Invalid input",
                reason: "Account is not a valid account",
            },
        };
    }

    if (!(await BudgetCategory.findById(body.categoryId))) {
        return {
            status: 400,
            body: {
                error: "Invalid input",
                reason: "Category is not a valid category",
            },
        };
    }

    const createdBy = res.userId;
    const newTransaction = new BudgetTransaction({
        account: body.accountId,
        date: body.date,
        description: body.description,
        category: body.categoryId,
        amount: body.amount,
        comments: body.comments,
        createdBy,
    });

    await newTransaction.save();

    return {
        status: 200,
        body: {
            message: "Transaction created successfully",
        },
    };
};
export const newTransaction = {
    middleware: [authenticate],
    handler: newTransactionHandler,
};
