import { Request, Response, NextFunction } from "express";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const db = req.app.locals.database;

  // parseInt because we don't want to include "truthy" numbers
  // e.g. hello10 = 10 > this should be NaN
  const sessionId = parseInt(req.cookies.id, 10);

  const session = db.auth.sessions.getSession(sessionId);
  if (session == null) {
    return res.status(401).json({
      error: "Unauthorised",
    });
  }

  res.session = session;
  return next();
}
