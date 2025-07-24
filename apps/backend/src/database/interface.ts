import {
  Auth$Session,
  Auth$User,
  Budgeting$Account,
  Budgeting$Category,
  Budgeting$Transaction,
  Budgeting$Workspace,
} from "@cooper/ts-rest/src/types";

export default interface DatabaseInterface {
  auth: {
    users: {
      isValidLogin: (username: string, password: string) => boolean;
      getUser: (username: string) => Auth$User | undefined;
      createUser: (user: Auth$User) => Auth$User | Error;
      updateUser: (username: string, firstName?: string, lastName?: string, password?: string) => Auth$User | Error;
      deleteUser: (username: string) => void;
    };

    sessions: {
      getSession: (sessionId: number) => Auth$Session | undefined;
      getUserSessions: (username: string) => Auth$Session[];
      createSession: (
        username: string,
        ip: string,
        userAgent: string,
        started: Date,
        expires: Date,
      ) => Auth$Session | Error;
      deleteSession: (sessionId: number) => void;
      updateSession: (
        sessionId: number,
        ip?: string,
        userAgent?: string,
        started?: Date,
        expires?: Date,
      ) => Auth$Session | Error;
    };
  };

  budgeting: {
    workspaces: {
      getWorkspace: (workspaceId: number) => Budgeting$Workspace | undefined;
      getUserWorkspaces: (username: string) => Budgeting$Workspace[];
      createWorkspace: (username: string, workspaceName: string) => Budgeting$Workspace | Error;
      deleteWorkspace: (workspaceId: number) => void;
      updateWorkspace: (workspaceId: number, name: string, users: string[]) => Budgeting$Workspace | Error;
    };

    accounts: {
      getAccount: (accountId: number) => Budgeting$Account | undefined;
      getWorkspaceAccounts: (workspace: number) => Budgeting$Account[];
      createAccount: (
        name: string,
        bank: string,
        description: string,
        workspace: number,
        createdBy: string,
      ) => Budgeting$Account | Error;
      deleteAccount: (accountId: number) => void;
      updateAccount: (
        accountId: number,
        name?: string,
        bank?: string,
        description?: string,
        createdBy?: string,
      ) => Budgeting$Account | Error /*  */;
    };

    categories: {
      getCategory: (categoryId: number) => Budgeting$Category | undefined;
      getWorkspaceCategories: (workspace: number) => Budgeting$Category[];
      createCategory: (name: string, createdBy: string, workspace: number) => Budgeting$Category | Error;
      deleteCategory: (categoryId: number) => void;
      updateCategory: (
        categoryId: number,
        workspace: number,
        name?: string,
        createdBy?: string,
      ) => Budgeting$Category | Error;
    };

    transactions: {
      getTransaction: (transactionId: number) => Budgeting$Transaction | undefined;
      getWorkspaceTransactions: (workspace: number) => Budgeting$Transaction[];
      createTransaction: (
        date: Date,
        description: string,
        createdBy: string,
        account: number,
        category: string,
        amount: number,
        comments: string | null,
        workspace: number,
      ) => Budgeting$Transaction | Error;
      deleteTransaction: (transactionId: number) => void;
      updateTransaction: (
        transactionId: number,
        workspace: number,
        date?: Date,
        description?: string,
        createdBy?: string,
        account?: number,
        category?: string,
        amount?: number,
        comments?: string | null,
      ) => Budgeting$Transaction | Error;
    };
  };
}
