import bcrypt from 'bcrypt';

/**
 * Synchronously hashes given password using bcrypt algorithm
 *
 * @param password Password string to be hashed
 * @returns {string} Hashed + salted
 */
export function saltedHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Synchronously compares password to hash
 *
 * @param password Password to be compared with given hash
 * @param saltedHash Hash to be compared with password
 * @returns {boolean} If password matches hash
 */
export function compareSaltedHash(
  password: string,
  saltedHash: string,
): boolean {
  return bcrypt.compareSync(password, saltedHash);
}
