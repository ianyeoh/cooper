export default interface DatabaseInterface {
    isValidLogin: (username: string, password: string) => boolean;
    getUser: (username: string) => any;
    createUser: (
        username: string,
        firstName: string,
        lastName: string,
        password: string
    ) => any;
    deleteUser: (username: string) => any;
    getSession: (sessionId: number) => any;
    createSession: (
        username: string,
        ip: string,
        userAgent: string,
        started: Date,
        expires: Date
    ) => any;
    deleteSession: (sessionId: number) => any;
}
