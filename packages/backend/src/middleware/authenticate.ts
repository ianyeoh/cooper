import { Request, Response, NextFunction } from "express";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const db = req.app.locals.database;
    const sessionId = req.cookies.id;

    const session = db.auth.sessions.getSession(sessionId);

    if (session == null)
        return res.status(401).json({
            error: "Unauthorised",
        });

    res.session = session;
    return next();
}
