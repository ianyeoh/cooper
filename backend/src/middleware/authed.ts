import { Request, Response, NextFunction } from "express";
import Session from "../db/sessions.ts";

export async function authed(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies.id;

    if (!sessionId) {
        return res.status(401).json({
            error: "Unauthorised",
        });
    }

    const validSession = await Session.findById(sessionId);
    if (!validSession) {
        return res.status(401).json({
            error: "Unauthorised",
        });
    }

    req.sessionId = sessionId;
    return next();
}
