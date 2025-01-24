import {
    Auth$Session,
    Auth$User,
    Budgeting$Account,
    Budgeting$Category,
    Budgeting$Transaction,
    Budgeting$Workspace,
} from "./types";

export default interface DatabaseInterface {
    // Auth.User
    isValidLogin: (username: string, password: string) => boolean;
    getUser: (username: string) => Auth$User | undefined;
    createUser: (user: Auth$User) => Auth$User | Error;
    updateUser: (
        username: string,
        firstName?: string,
        lastName?: string,
        password?: string
    ) => Auth$User | Error;
    deleteUser: (username: string) => void;

    // Auth.Session
    getSession: (sessionId: number) => Auth$Session | undefined;
    getUserSessions: (username: string) => Auth$Session[] | Error;
    createSession: (
        username: string,
        ip: string,
        userAgent: string,
        started: Date,
        expires: Date
    ) => Auth$Session | Error;
    deleteSession: (sessionId: number) => void;
    updateSession: (
        sessionId: number,
        ip?: string,
        userAgent?: string,
        started?: Date,
        expires?: Date
    ) => Auth$Session | Error;

    // Budgeting.Workspace
    getWorkspace: (workspaceId: number) => Budgeting$Workspace | undefined;
    getUserWorkspaces: (username: string) => Budgeting$Workspace[];
    createWorkspace: (username: string) => Budgeting$Workspace | Error;
    deleteWorkspace: (workspaceId: number) => void;
    updateWorkspace: (
        workspaceId: number,
        users: string[]
    ) => Budgeting$Workspace | Error;

    // Budgeting.Account
    getAccount: (accountId: number) => Budgeting$Account | undefined;
    getWorkspaceAccounts: (workspace: number) => Budgeting$Account[] | Error;
    createAccount: (
        name: string,
        bank: string,
        description: string,
        workspace: string,
        createdBy: string
    ) => Budgeting$Account | Error;
    deleteAccount: (accountId: number) => void;
    updateAccount: (
        accountId: number,
        name?: string,
        bank?: string,
        description?: string,
        workspace?: string,
        createdBy?: string
    ) => Budgeting$Account | Error;

    // Budgeting.Category
    getCategory: (categoryId: number) => Budgeting$Category | undefined;
    getWorkspaceCategories: (workspace: number) => Budgeting$Category[];
    createCategory: (
        name: string,
        createdBy: string,
        workspace: number
    ) => Budgeting$Category | Error;
    deleteCategory: (categoryId: number) => void;
    updateCategory: (
        categoryId: number,
        name?: string,
        createdBy?: string,
        workspace?: number
    ) => Budgeting$Category | Error;

    // Budgeting.Transaction
    getTransaction: (
        transactionId: number
    ) => Budgeting$Transaction | undefined;
    getWorkspaceTransactions: (workspace: number) => Budgeting$Transaction[];
    createTransaction: (
        date: Date,
        description: string,
        createdBy: string,
        account: number,
        category: string,
        amount: number,
        comments: string | null,
        workspace: number
    ) => Budgeting$Transaction | Error;
    deleteTransaction: (transactionId: number) => void;
    updateTransaction: (
        transactionId: number,
        date?: Date,
        description?: string,
        createdBy?: string,
        account?: number,
        category?: string,
        amount?: number,
        comments?: string | null,
        workspace?: number
    ) => Budgeting$Transaction | Error;
}
