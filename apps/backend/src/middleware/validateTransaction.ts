import { Request, Response, NextFunction } from 'express';
import guard from '@cooper/backend/src/middleware/guard';

export async function validateTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const db = req.app.locals.database;

  // parseInt because we don't want to include "truthy" numbers
  // e.g. hello10 = 10 > this should be NaN
  const transactionId = parseInt(req.params.transactionId, 10);

  if (Number.isNaN(transactionId)) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const transaction = db.budgeting.transactions.getTransaction(transactionId);

  // Transaction does not exist
  if (transaction == null) {
    return res.status(404).json({
      error: 'Transaction does not exist',
    });
  }

  // Check that transaction being accessed belongs to the workspace
  if (transaction.workspace !== guard(res.workspace).workspaceId) {
    return res.status(401).json({
      error: 'Unauthorised',
    });
  }

  res.transaction = transaction;
  return next();
}
