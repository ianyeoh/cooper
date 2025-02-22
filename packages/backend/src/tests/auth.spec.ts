import request from "supertest";
import app from "@cooper/backend/src/server";
import { expect } from "chai";

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
            .expect(400, done);
    });

    it("should succeed", (done) => {
        request(app)
            .post("/api/auth/login")
            .send({
                username: "ianyeoh",
                password: "asd",
            })
            .expect(200)
            .then((response) => {
                expect(response.body.message).equal("Logged in successfully");
            })
            .then(done);
    });
});
