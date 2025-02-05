import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "../../../middleware/authenticate";

const getAccountsHandler: AppRouteImplementation<
    typeof contract.protected.budgeting.workspaces.
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
    middleware: [authenticate],
    handler: getAccountsHandler,
};

const newAccountHandler: AppRouteImplementation<
    typeof contract.budgeting.accounts.newAccount
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
    middleware: [authenticate],
    handler: newAccountHandler,
};
