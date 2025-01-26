import InMemoryDatabase from "./database/in-memory/database";

declare global {
    namespace Express {
        export interface Response {
            sessionId?: string;
            userId?: string;
        }
        export interface Request {
        }
    }
}
