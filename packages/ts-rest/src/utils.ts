/**
 * Utility function to parse an API error safely when using @ts-rest React Query
 * client (which fails to type API errors correctly).
 *
 * All returned errors in our ts-rest contract will return the error
 * as error.body.error, but TypeScript doesn't know that.
 */
export function parseError(error: any):
    | {
          isKnownError: false;
      }
    | { isKnownError: true; errMsg: string } {
    if (error.body.error) {
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
