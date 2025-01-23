import DatabaseInterface from "../interface";
import {
    Auth$Sessions,
    Auth$SessionSchema,
    Auth$Users,
    Auth$UserSchema,
    Budgeting$Accounts,
    Budgeting$Categories,
    Budgeting$Transactions,
} from "./types";

export default class InMemoryDatabase implements DatabaseInterface {
    // Authentication
    authUsers: Auth$Users;
    authSessions: Auth$Sessions;

    // Budgeting
    budgetingAccounts: Budgeting$Accounts;
    budgetingCategories: Budgeting$Categories;
    budgetingTransactions: Budgeting$Transactions;

    // Initialise default data-store values here
    constructor() {
        this.authUsers = new Map();
        this.authSessions = new Map();
        this.budgetingAccounts = new Map();
        this.budgetingCategories = new Map();
        this.budgetingTransactions = new Map();
    }

    // Generates an unused numeric key for a map using integers as keys
    _keyGen(map: Map<number, any>) {
        let newKey = map.size + 1;
        while (map.has(newKey)) {
            newKey++;
        }
        return newKey;
    }

    isValidLogin(username: string, password: string) {
        const user = this.authUsers.get(username.toLowerCase());

        if (user == null) return false;

        return user.password === password;
    }

    getUser(username: string) {
        return this.authUsers.get(username.toLowerCase());
    }

    createUser(
        username: string,
        firstName: string,
        lastName: string,
        password: string
    ) {
        if (this.getUser(username) != null) {
            return new Error("User with username already exists");
        }

        const result = Auth$UserSchema.safeParse({
            username,
            firstName,
            lastName,
            password,
        });

        if (!result.success) return result.error;

        // Key is username set to lower case (for case insensitivity)
        this.authUsers.set(username.toLowerCase(), result.data);
    }

    deleteUser(username: string) {
        this.authUsers.delete(username.toLowerCase());
    }

    getSession(sessionId: number) {
        return this.authSessions.get(sessionId);
    }

    createSession(
        username: string,
        ip: string,
        userAgent: string,
        started: Date,
        expires: Date
    ) {
        const newKey = this._keyGen(this.authSessions);
        const result = Auth$SessionSchema.safeParse({
            sessiondId: newKey,
            username,
            ip,
            userAgent,
            started,
            expires,
        });

        if (!result.success) return result.error;

        this.authSessions.set(newKey, result.data);
    }

    deleteSession(sessionId: number) {
        this.authSessions.delete(sessionId);
    }
}
