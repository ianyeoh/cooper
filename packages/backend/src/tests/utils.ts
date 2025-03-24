import { expect } from "chai";
import request from "supertest";
import app from "@cooper/backend/src/server";

/**
 * Extracts the set-cookie header on a supertest response
 * @param response Supertest response object
 * @returns Object containing cookie fields, keys are strings, values are strings or undefined
 */
export function extractCookie(response: Response): {
    [key: string]: string | undefined;
} {
    const cookies = response.headers["set-cookie"][0]
        .split("; ")
        .reduce((obj, item) => {
            const [key, value] = item.split("=");
            obj[key] = value;
            return obj;
        }, {});

    return cookies;
}

request.Test.prototype.authenticate = async function ({ username, password }) {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            username,
            password,
        })
        .expect(200);

    const cookie = extractCookie(response);
    expect(cookie["id"]).to.not.equal(null);

    return request(this.app).set("Cookie", [`id=${cookie["id"]}`]);
};
export default request;
