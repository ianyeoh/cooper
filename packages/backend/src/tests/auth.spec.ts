import request from "@cooper/backend/src/tests/utils";
import app from "@cooper/backend/src/server";
import { expect } from "chai";
import { extractCookie } from "@cooper/backend/src/tests/utils";

describe("POST /api/auth/login", () => {
    it("should fail because of empty body", (done) => {
        request(app).post("/api/auth/login").expect(400, done);
    });

    it("should fail because of invalid body format", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                not: "a valid field",
            })
            .expect(400, done);
    });

    it("should fail because of invalid data types", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                username: 123,
                password: new Date(),
            })
            .expect(400, done);
    });

    it("should fail because of a missing field", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                username: "ianyeoh",
            })
            .expect(400, done);
    });

    it("should fail because user does not exist", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                username: "user that does not exist",
                password: "password",
            })
            .expect(401, done);
    });

    it("should succeed and set-cookie session id (secure, http-only, same-site, with expiry)", (done) => {
        request(app)
            .post("/api/auth/login")
            .authenticate({
                username: "ianyeoh",
                password: "asd",
            })
            .expect(200)
            .then((response) => {
                const cookie = extractCookie(response);
                expect(cookie["id"]).to.not.equal(null);
                expect(cookie["Expires"]).to.not.equal(null);
                expect(cookie["SameSite"]).to.equal("Strict");
                expect(cookie["Secure"]).to.equal(undefined);
                expect(cookie["HttpOnly"]).to.equal(undefined);
            })
            .then(done);
    });
});

describe("POST /api/auth/logout", () => {
    it("should fail because not logged in", async (done) => {
        request(app).post("/api/auth/logout").expect(401, done);
    });

    it("should succeed after logging in", async (done) => {
        const action = await request(app).post("/api/auth/logout");
    });
});
