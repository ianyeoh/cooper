import DatabaseInterface from "../interface";
import { z } from "zod";
import {
    Auth$Session,
    Auth$SessionSchema,
    Auth$User,
    Auth$UserSchema,
    Budgeting$Account,
    Budgeting$AccountSchema,
    Budgeting$Category,
    Budgeting$Transaction,
    Budgeting$Workspace,
} from "../types";

export default class InMemoryDatabase implements DatabaseInterface {
    // Authentication
    private authUsers: Map<string, Auth$User>;
    private authSessions: Map<number, Auth$Session>;

    // Budgeting
    private budgetingWorkspaces: Map<number, Budgeting$Workspace>;
    private budgetingAccounts: Map<number, Budgeting$Account>;
    private budgetingCategories: Map<number, Budgeting$Category>;
    private budgetingTransactions: Map<number, Budgeting$Transaction>;

    // Initialise default data-store values here
    constructor() {
        this.authUsers = new Map();
        this.authSessions = new Map();
        this.budgetingWorkspaces = new Map();
        this.budgetingAccounts = new Map();
        this.budgetingCategories = new Map();
        this.budgetingTransactions = new Map();
    }

    /**
     * Generates an unused numeric key for a map which uses integers as keys.
     * Increments the key by current size of map, guarantees non-collision.
     * @param map Map of which to generate the key for
     * @returns {number} Numeric key
     */
    _keyGen(map: Map<number, any>): number {
        let newKey = map.size + 1;
        while (map.has(newKey)) {
            newKey++;
        }
        return newKey;
    }

    _genericGet<KeyType>(map: Map<KeyType, any>, key: KeyType) {
        return map.get(key);
    }

    /**
     * Generic creation function for a record for a map used by this in-memory
     * database. Parses the given data based on the given schema
     *
     * @param map Map of which record will be added to
     * @param schema Zod schema that will be used to parse
     * @param key Key of key-value pair that will be assigned to this new record in the map
     * @param data Data to add, will be parsed using Zod based on given schema
     * @param overwrite Set to true if existing record should be overwritten if present. Defaults to false
     * @returns Returns the newly created record, or an Error if failed to create
     */
    _genericCreate<KeyType, DataType extends z.ZodTypeAny>(
        map: Map<KeyType, z.infer<DataType>>,
        schema: DataType,
        key: KeyType,
        data: unknown,
        overwrite: boolean = false
    ): z.infer<DataType> {
        if (!overwrite && map.get(key) != null)
            return new Error("Record with key already exists");

        const result = schema.safeParse(data) as z.infer<DataType>;
        if (!result.success) return result.error;

        map.set(key, result.data);

        const newRecord = map.get(key);
        if (!newRecord) return new Error("Failed to create record");
        return newRecord;
    }

    _genericDelete<KeyType>(map: Map<KeyType, any>, key: KeyType) {
        map.delete(key);
    }

    _genericUpdate<KeyType, DataType extends z.ZodObject<any, any, any, any>>(
        map: Map<KeyType, z.infer<DataType>>,
        schema: DataType,
        key: KeyType,
        data: unknown
    ) {
        // Check an existing record exists
        const existingRecord = map.get(key);
        if (!existingRecord) return new Error("Record with key does not exist");

        // Derive a new object schema where all key/values are optional (the caller can
        // change only the fields they want to)
        const partialSchema = schema.partial();

        // Parse the data using this partial schema
        const result = partialSchema.safeParse(data);
        if (!result.success) return result.error;

        // Join existing data with updated data, overwriting
        // existing data if the field has been set
        const newData = {
            ...existingRecord,
            ...result.data,
        };
        map.set(key, newData);

        return newData;
    }

    _genericMapFilter<KeyType, DataType>(
        map: Map<KeyType, DataType>,
        predicate: (
            value: DataType,
            key: KeyType,
            map: Map<KeyType, DataType>
        ) => boolean
    ): DataType[] {
        const filterItems: DataType[] = [];
        map.forEach((value, key, map) => {
            if (predicate(value, key, map)) filterItems.push(value);
        });
        return filterItems;
    }

    /*
     * ======================
     *      Auth.Users
     * ======================
     */

    isValidLogin(username: string, password: string) {
        const user = this.authUsers.get(username.toLowerCase());
        if (user == null) return false;
        return user.password === password;
    }

    getUser(username: string) {
        return this._genericGet(this.authUsers, username.toLowerCase());
    }

    createUser(user: Auth$User) {
        return this._genericCreate(
            this.authUsers,
            Auth$UserSchema,
            user.username.toLowerCase(),
            user
        );
    }

    updateUser(
        username: string,
        firstName?: string,
        lastName?: string,
        password?: string
    ) {
        return this._genericUpdate(
            this.authUsers,
            Auth$UserSchema,
            username.toLowerCase(),
            {
                firstName,
                lastName,
                password,
            }
        );
    }

    deleteUser(username: string) {
        this._genericDelete(this.authUsers, username.toLowerCase());
    }

    /*
     * ======================
     *     Auth.Sessions
     * ======================
     */

    getSession(sessionId: number) {
        return this._genericGet(this.authSessions, sessionId);
    }

    getUserSessions(username: string) {
        if (this.getUser(username) == null)
            return new Error("User does not exist");

        return this._genericMapFilter(this.authSessions, (value) => {
            return value.username.toLowerCase() === username.toLowerCase();
        });
    }

    createSession(
        username: string,
        ip: string,
        userAgent: string,
        started: Date,
        expires: Date
    ) {
        const newKey = this._keyGen(this.authSessions);
        return this._genericCreate(
            this.authSessions,
            Auth$SessionSchema,
            newKey,
            {
                sessionId: newKey,
                username,
                ip,
                userAgent,
                started,
                expires,
            }
        );
    }

    deleteSession(sessionId: number) {
        this._genericDelete(this.authSessions, sessionId);
    }

    updateSession(
        sessionId: number,
        ip?: string,
        userAgent?: string,
        started?: Date,
        expires?: Date
    ) {
        return this._genericUpdate(
            this.authSessions,
            Auth$SessionSchema,
            sessionId,
            {
                sessionId,
                ip,
                userAgent,
                started,
                expires,
            }
        );
    }

    /*
     * ======================
     *  Budgeting.Workspaces
     * ======================
     */

    getWorkspace(workspaceId: number) {
        return this._genericGet(this.budgetingWorkspaces, workspaceId);
    }

    getUserWorkspaces(username: string) {
        return this._genericMapFilter(this.budgetingWorkspaces, (value) => {
            return value.users.includes(username.toLowerCase());
        });
    }

    createWorkspace(username: string) {
        const newKey = this._keyGen(this.budgetingWorkspaces);
        return this._genericCreate(
            this.budgetingWorkspaces,
            Budgeting$Workspace,
            newKey,
            {
                workspaceId: newKey,
                users: [username],
            }
        );
    }

    deleteWorkspace(workspaceId: number) {
        this._genericDelete(this.budgetingWorkspaces, workspaceId);
    }

    updateWorkspace(workspaceId: number, users: string[]) {
        return this._genericUpdate(
            this.budgetingWorkspaces,
            Budgeting$Workspace,
            workspaceId,
            {
                users,
            }
        );
    }

    /*
     * ======================
     *   Budgeting.Accounts
     * ======================
     */

    getAccount(accountId: number) {
        return this._genericGet(this.budgetingAccounts, accountId);
    }

    getWorkspaceAccounts(workspace: number) {
        return this._genericMapFilter(this.budgetingAccounts, (value) => {
            return value.workspace === workspace;
        });
    }

    createAccount(
        name: string,
        bank: string,
        description: string,
        workspace: string,
        createdBy: string
    ) {
        const newKey = this._keyGen(this.budgetingAccounts);
        return this._genericCreate(
            this.budgetingAccounts,
            Budgeting$AccountSchema,
            newKey,
            {
                accountId: newKey,
                name,
                bank,
                description,
                workspace,
                createdBy,
            }
        );
    }

    deleteAccount(accountId: number) {
        this._genericDelete(this.budgetingAccounts, accountId);
    }

    updateAccount(
        accountId: number,
        name?: string,
        bank?: string,
        description?: string,
        workspace?: string,
        createdBy?: string
    ) {
        return this._genericUpdate(
            this.budgetingAccounts,
            Budgeting$AccountSchema,
            accountId,
            {
                name,
                bank,
                description,
                workspace,
                createdBy,
            }
        );
    }

    /*
     * ======================
     *  Budgeting.Categories
     * ======================
     */

    /*
     * ======================
     * Budgeting.Transactions
     * ======================
     */
}
