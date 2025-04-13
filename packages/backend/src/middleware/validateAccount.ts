import { Request, Response, NextFunction } from "express";
import guard from "@cooper/backend/src/middleware/guard";

export async function validateAccount(req: Request, res: Response, next: NextFunction) {
  const db = req.app.locals.database;

  // parseInt because we don't want to include "truthy" numbers
  // e.g. hello10 = 10 > this should be NaN
  const accountId = parseInt(req.params.accountId, 10);

  if (Number.isNaN(accountId)) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  const account = db.budgeting.accounts.getAccount(accountId);

  // Transaction does not exist
  if (account == null) {
    return res.status(404).json({
      error: "Account does not exist",
    });
  }

  // Check that account being accessed belongs to the workspace
  if (account.workspace !== guard(res.workspace).workspaceId) {
    return res.status(401).json({
      error: "Unauthorised",
    });
  }

  res.account = account;
  return next();
}
