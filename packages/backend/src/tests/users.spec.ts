import { expect } from "chai";
import { request, authenticate, testFor, testRoute, testProtected } from "@cooper/backend/src/tests/utils";
import { generateMock } from "@anatine/zod-mock";
import { Auth$UserSchema } from "@cooper/ts-rest/src/types";
import { seed } from "@cooper/backend/src/tests/mocking";
import { contract } from "@cooper/ts-rest/src/contract";

const { getSelf, getUser } = contract.protected.users;
const { signup } = contract.public.auth;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(getSelf), () => {
  testProtected(getSelf);

  it("should return our own user data", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Get self
    const response = await testRoute(authedRequest, getSelf).expect(200);

    expect(response.body.user).to.deep.equal({
      username: existingUser.username,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    });
  });
});

describe(testFor(getUser), () => {
  testProtected(getUser);

  it("should return our own user data", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Get self
    const response = await testRoute(authedRequest, getUser, {
      username: existingUser.username,
    });

    expect(response.body.user).to.deep.equal({
      username: existingUser.username,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    });
  });

  it("should return other user data", async function () {
    const newUser = generateMock(Auth$UserSchema, { seed: seed + 1 });

    // Create other user, should succeed
    await testRoute(request(), signup).send(newUser).expect(200);

    // Login
    const authedRequest = await authenticate({
      username: newUser.username,
      password: newUser.password,
    });

    // Get other user's data
    const response = await testRoute(authedRequest, getUser, {
      username: newUser.username,
    });

    expect(response.body.user).to.deep.equal({
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  });
});
