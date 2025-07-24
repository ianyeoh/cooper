import { Request, Response, NextFunction } from 'express';
import guard from '@cooper/backend/src/middleware/guard';

export async function validateWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const db = req.app.locals.database;

  // parseInt because we don't want to include "truthy" numbers
  // e.g. hello10 = 10 > this should be NaN
  const workspaceId = parseInt(req.params.workspaceId, 10);

  // workspaceId is wildly invalid
  if (Number.isNaN(workspaceId)) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const workspace = db.budgeting.workspaces.getWorkspace(workspaceId);

  // Workspace does not exist
  if (workspace == null) {
    return res.status(404).json({
      error: 'Workspace does not exist',
    });
  }

  const username = guard(res.session).username;
  // User does not have access to workspace
  if (!workspace.users.includes(username)) {
    return res.status(401).json({
      error: 'Unauthorised',
    });
  }

  res.workspace = workspace;
  return next();
}
