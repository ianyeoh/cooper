import { Request, Response, NextFunction } from "express";
import guard from "@cooper/backend/src/middleware/guard";

export async function validateCategory(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const db = req.app.locals.database;

    // parseInt because we don't want to include "truthy" numbers
    // e.g. hello10 = 10 > this should be NaN
    const categoryId = parseInt(req.params.categoryId, 10);

    if (Number.isNaN(categoryId)) {
        return res.status(401).json({ error: "Unauthorised" });
    }

    const category = db.budgeting.categories.getCategory(categoryId);

    // Category does not exist
    if (category == null) {
        return res.status(404).json({
            error: "Category does not exist",
        });
    }

    // Check that category being accessed belongs to the workspace
    if (category.workspace !== guard(res.workspace).workspaceId) {
        return res.status(401).json({
            error: "Unauthorised",
        });
    }

    res.category = category;
    return next();
}
