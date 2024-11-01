import bcrypt from "bcryptjs";

export function saltedHash(password: string) {
    return bcrypt.hashSync(password, 10);
}

export function compareSaltedHash(password: string, saltedHash: string) {
    return bcrypt.compareSync(password, saltedHash);
}
