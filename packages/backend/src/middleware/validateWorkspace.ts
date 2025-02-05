import { Request, Response, NextFunction } from "express";

export async function validateWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const db = req.app.locals.database;
    const workspaceId = Number(req.params.workspaceId);

    if (Number.isNaN(workspaceId))
        return res.status(401).json({ error: "Unauthorised" });

    const workspace = db.budgeting.workspaces.getWorkspace(workspaceId);

    if (workspace == null)
        return res.status(401).json({
            error: "Unauthorised",
        });

    res.workspace = workspace;
    return next();
}
