import { z } from 'zod';

// Authentication
export const Auth$UserSchema = z.object({
  username: z.string().min(2).max(50),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  password: z.string().min(2).max(250),
});
export type Auth$User = z.infer<typeof Auth$UserSchema>;

export const Auth$SessionSchema = z.object({
  sessionId: z.number(),
  username: z.string().min(2).max(50),
  ip: z.string().ip(),
  userAgent: z.string().min(2).max(250),
  started: z.coerce.date(),
  expires: z.coerce.date(),
});
export type Auth$Session = z.infer<typeof Auth$SessionSchema>;

// Budgeting
export const Budgeting$WorkspaceSchema = z.object({
  workspaceId: z.number(),
  name: z.string().min(2).max(50),
  users: z.array(z.string().min(2).max(50)),
});
export type Budgeting$Workspace = z.infer<typeof Budgeting$WorkspaceSchema>;

export const Budgeting$AccountSchema = z.object({
  accountId: z.number(),
  name: z.string().min(2).max(50),
  bank: z.string().min(2).max(50),
  description: z.string().min(2).max(255),
  createdBy: z.string().min(2).max(50),
  workspace: z.number(),
});
export type Budgeting$Account = z.infer<typeof Budgeting$AccountSchema>;

export const Budgeting$CategorySchema = z.object({
  categoryId: z.number(),
  name: z.string().min(2).max(50),
  createdBy: z.string().min(2).max(50),
  workspace: z.number(),
});
export type Budgeting$Category = z.infer<typeof Budgeting$CategorySchema>;

export const Budgeting$TransactionSchema = z.object({
  transactionId: z.number(),
  account: z.number(),
  date: z.coerce.date(),
  description: z.string().min(2).max(255),
  category: z.string().min(2).max(50),
  amount: z.number(),
  comments: z.string().max(500).nullable(),
  createdBy: z.string().min(2).max(50),
  workspace: z.number(),
});
export type Budgeting$Transaction = z.infer<typeof Budgeting$TransactionSchema>;
