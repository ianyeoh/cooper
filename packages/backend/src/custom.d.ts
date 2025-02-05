import { Auth$Session, Budgeting$Workspace } from "@cooper/ts-rest/src/types";
import DatabaseInterface from "./database/interface";

declare global {
    namespace Express {
        export interface Response {
            session: Auth$Session;
            workspace: Budgeting$Workspace;
        }
        export interface Locals {
            database: DatabaseInterface;
        }
    }
}
