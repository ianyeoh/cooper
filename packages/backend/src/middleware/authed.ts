import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export async function authed(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies.id;

    if (
        // Check input
        sessionId && // sessionId cookie present
        mongoose.Types.ObjectId.isValid(sessionId) // sessionId can be cast to ObjectId
    ) {
        const session = await Session.findById(sessionId);

        // If valid session
        if (session) {
            res.sessionId = sessionId;
            res.userId = session.user.toString();
            return next();
        }
    }

    return res.status(401).json({
        error: "Unauthorised",
    });
}
