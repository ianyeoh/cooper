/**
 * Utility function to parse an API error safely when using @ts-rest React Query
 * client (which fails to type API errors correctly).
 *
 * All returned errors in our ts-rest contract will return the error
 * as error.body.error, but TypeScript doesn't know that.
 */
export function parseError(error: unknown):
  | {
      isKnownError: false;
    }
  | { isKnownError: true; errMsg: string } {
  if (
    typeof error === "object" &&
    error !== null &&
    "body" in error &&
    typeof error.body === "object" &&
    error.body !== null &&
    "error" in error.body &&
    typeof error.body.error === "string"
  ) {
    return {
      isKnownError: true,
      errMsg: error.body.error,
    };
  } else {
    return {
      isKnownError: false,
    };
  }
}
