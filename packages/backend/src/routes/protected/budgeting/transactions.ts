import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "@cooper/backend/src/middleware/authenticate";
import { validateWorkspace } from "@cooper/backend/src/middleware/validateWorkspace";
import { validateTransaction } from "@cooper/backend/src/middleware/validateTransaction";
import guard from "@cooper/backend/src/middleware/guard";

const getTransactionsHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.transactions.getTransactions
> = async function ({ req, res }) {
  const db = req.app.locals.database;
  const workspaceId = guard(res.workspace).workspaceId;

  const transactions = db.budgeting.transactions.getWorkspaceTransactions(workspaceId);

  return {
    status: 200,
    body: {
      transactions,
    },
  };
};
export const getTransactions = {
  middleware: [authenticate, validateWorkspace],
  handler: getTransactionsHandler,
};

const newTransactionHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.transactions.newTransaction
> = async function ({ req, res, body }) {
  const db = req.app.locals.database;
  const workspaceId = guard(res.workspace).workspaceId;
  const createdBy = guard(res.session).username;

  const { description, date, account, category, amount, comments } = body;

  const newTransaction = db.budgeting.transactions.createTransaction(
    date,
    description,
    createdBy,
    account,
    category,
    amount,
    comments,
    workspaceId,
  );

  if (newTransaction instanceof Error) {
    throw newTransaction;
  }

  return {
    status: 200,
    body: { message: "Transaction created successfully", transaction: newTransaction },
  };
};
export const newTransaction = {
  middleware: [authenticate, validateWorkspace],
  handler: newTransactionHandler,
};

const updateTransactionHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.transactions.byId.updateTransaction
> = async function ({ req, res, body }) {
  const db = req.app.locals.database;

  const workspaceId = guard(res.workspace).workspaceId;
  const { transactionId, createdBy } = guard(res.transaction);
  const { description, date, account, category, amount, comments } = body;

  const updatedTransaction = db.budgeting.transactions.updateTransaction(
    transactionId,
    workspaceId,
    date,
    description,
    createdBy,
    account,
    category,
    amount,
    comments,
  );

  if (updatedTransaction instanceof Error) {
    throw updatedTransaction;
  }

  return {
    status: 200,
    body: { message: "Transaction updated successfully" },
  };
};
export const updateTransaction = {
  middleware: [authenticate, validateWorkspace, validateTransaction],
  handler: updateTransactionHandler,
};

const deleteTransactionHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.transactions.byId.deleteTransaction
> = async function ({ req, res }) {
  const db = req.app.locals.database;

  const transactionId = guard(res.transaction).transactionId;

  db.budgeting.transactions.deleteTransaction(transactionId);

  return {
    status: 200,
    body: { message: "Transaction deleted sucessfully" },
  };
};
export const deleteTransaction = {
  middleware: [authenticate, validateWorkspace, validateTransaction],
  handler: deleteTransactionHandler,
};
