import {
  Auth$Session,
  Budgeting$Account,
  Budgeting$Category,
  Budgeting$Transaction,
  Budgeting$Workspace,
} from "@cooper/ts-rest/src/types";
import DatabaseInterface from "@cooper/backend/src/database/interface";

declare global {
  namespace Express {
    interface Response {
      session?: Auth$Session;
      workspace?: Budgeting$Workspace;
      transaction?: Budgeting$Transaction;
      account?: Budgeting$Account;
      category?: Budgeting$Category;
    }
    interface Locals {
      database: DatabaseInterface;
    }
  }
}
