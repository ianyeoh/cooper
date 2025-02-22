export default function guard<T>(property: T | undefined): T {
    if (property == null) {
        throw new Error(
            `You are trying to access a middleware property on the response object that is undefined at run time. 
            Are you sure the middleware is actually running before the handler for this route?`
        );
    }

    return property;
}
