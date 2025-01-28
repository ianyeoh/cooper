import DatabaseInterface from "./database/interface";

declare global {
    namespace Express {
        export interface Response {
            sessionId?: string;
            userId?: string;
        }
        export interface Locals {
            database: DatabaseInterface;
        }
    }
}
