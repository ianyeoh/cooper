import { AppRouteImplementation } from "@ts-rest/express";
import Session from "../db/session";
import { contract } from "@cooper/ts-rest/src/contract";
import { authed } from "../middleware/authed";
import BudgetAccount from "../db/budgetAccount";
import User, { UserType } from "../db/user";

const getAccountsHandler: AppRouteImplementation<
    typeof contract.accounts.getAccounts
> = async function () {
    const accounts = await BudgetAccount.find().populate<{ owner: UserType }>({
        path: "owner",
        select: ["username", "firstName", "lastName"],
    });

    return {
        status: 200,
        body: { accounts },
    };
};
export const getAccounts = {
    middleware: [authed],
    handler: getAccountsHandler,
};

const newAccountHandler: AppRouteImplementation<
    typeof contract.accounts.newAccount
> = async function ({ body }) {
    const owner = await User.findById(body.ownerId);

    if (!owner) {
        return {
            status: 400,
            body: {
                error: "Invalid input",
                reason: "Owner is not a valid user",
            },
        };
    }

    const newAccount = new BudgetAccount({
        owner: body.ownerId,
        bank: body.bank,
        name: body.name,
        description: body.description,
    });

    await newAccount.save();

    return {
        status: 200,
        body: {
            message: "Account created successfully",
        },
    };
};
export const newAccount = {
    middleware: [authed],
    handler: newAccountHandler,
};
