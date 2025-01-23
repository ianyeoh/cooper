import { trace } from "console";
import { z } from "zod";

// Authentication
export const Auth$UserSchema = z.object({
    username: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
});
export type Auth$User = z.infer<typeof Auth$UserSchema>;
export type Auth$Users = Map<string, Auth$User>;

export const Auth$SessionSchema = z.object({
    sessionId: z.number(),
    username: z.string().min(2).max(50),
    ip: z.string().ip(),
    userAgent: z.string().min(2).max(50),
    started: z.date(),
    expires: z.date(),
});
export type Auth$Session = z.infer<typeof Auth$SessionSchema>;
export type Auth$Sessions = Map<number, Auth$Session>;

// Budgeting
export const Budgeting$AccountSchema = z.object({
    accountId: z.number(),
    name: z.string().min(2).max(50),
    bank: z.string().min(2).max(50),
    description: z.string().min(2).max(255),
    owner: z.string().min(2).max(50),
});
export type Budgeting$Account = z.infer<typeof Budgeting$AccountSchema>;
export type Budgeting$Accounts = Map<number, Budgeting$Account>;

export const Budgeting$CategorySchema = z.object({
    name: z.string().min(2).max(50),
});
export type Budgeting$Category = z.infer<typeof Budgeting$CategorySchema>;
export type Budgeting$Categories = Map<number, Budgeting$Category>;

export const Budgeting$TransactionSchema = z.object({
    transactionId: z.number(),
    account: z.number(),
    date: z.date(),
    description: z.string().min(2).max(255),
    category: z.string().min(2).max(50),
    amount: z.number(),
    comments: z.string().max(500).nullable(),
    createdBy: z.string().min(2).max(50),
});
export type Budgeting$Transaction = z.infer<typeof Budgeting$TransactionSchema>;
export type Budgeting$Transactions = Map<number, Budgeting$Transaction>;
