import { default as supertestRequest, Response } from "supertest";
import app from "@cooper/backend/src/server";
import TestAgent from "supertest/lib/agent";
import { contract } from "@cooper/ts-rest/src/contract";

/**
 * Extracts the set-cookie header on a supertest response
 * @param response Supertest response object
 * @returns Object containing cookie fields, keys are strings, values are strings or undefined
 */
function extractCookies(response: Response): {
    [key: string]: string;
}[] {
    const cookies = Object.values(response.headers["set-cookie"]).map(
        (cookieStr) => {
            return cookieStr.split("; ").reduce((obj, item) => {
                const [key, value] = item.split("=");
                obj[key] = value;
                return obj;
            }, {});
        }
    );

    return cookies;
}

/**
 * Given a ts-rest route object, returns the a string representing
 * what the test is testing for, e.g. POST /api/auth/login
 * @param route ts-rest route we are testing for
 * @returns {string} String in format [route.method] [route.path]
 */
function testFor(route: { method: string; path: string }): string {
    return `${route.method} ${route.path}`;
}

/**
 * After passing a Supertest request object, the ts-rest route to
 * be tested and optionally args used as route path arguments,
 * returns the Supertest route test with method and path already set
 *
 * @param request Supertest request object
 * @param route ts-rest route to be testing
 * @param args Optional args object, keys represent pattern in route path
 * and values are strings that will replace the pattern in the path. E.g.
 *
 * Path: /api/auth/users/:username
 * Args: {
 *          username: "ianyeoh"
 *       }
 *
 * Resulting path: /api/auth/users/ianyeoh
 *
 * @returns Supertest route test with method and path already set
 */
function testRoute(
    request: TestAgent,
    route: {
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
        path: string;
    },
    args?: {
        [key: string]: string;
    }
) {
    let routePath = route.path;

    if (args) {
        Object.entries(args).forEach(([key, value]) => {
            if (routePath.includes(`:${key}`)) {
                routePath = routePath.replace(`:${key}`, value);
            } else {
                throw new Error(`:${key} does not exist in path ${routePath}`);
            }
        });
    }

    return request[route.method.toLowerCase()](routePath);
}

function testProtected(route: {
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
    path: string;
}) {
    return it("should fail because not logged in", function (done) {
        testRoute(request(), route).expect(401, done);
    });
}

const request = function () {
    return supertestRequest(app);
};

// Authed supertest object factory, cookies are persisted with subsequent requests
const authenticate = async function ({
    username,
    password,
}: {
    username: string;
    password: string;
}) {
    const newAuthedRequest = supertestRequest.agent(app);

    // Do the login
    const response: Response = await newAuthedRequest
        .post("/api/auth/login")
        .send({
            username,
            password,
        });

    // Put the sessionId cookie in the jar for subsequent requests
    const cookies = extractCookies(response);
    newAuthedRequest.jar.setCookie(`id=${cookies[0]["id"]}`);

    return newAuthedRequest;
};

export {
    extractCookies,
    request,
    authenticate,
    testFor,
    testRoute,
    testProtected,
};
