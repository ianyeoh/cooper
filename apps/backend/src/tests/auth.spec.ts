import { expect } from 'chai';
import {
  request,
  authenticate,
  extractCookies,
  testFor,
  testRoute,
  testProtected,
} from '@cooper/backend/src/tests/utils';
import { generateMock } from '@anatine/zod-mock';
import { Auth$UserSchema } from '@cooper/ts-rest/src/types';
import { seed } from '@cooper/backend/src/tests/mocking';
import { contract } from '@cooper/ts-rest/src/contract';

const { login, logout, signup, validSession, getSessions } =
  contract.public.auth;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(signup), () => {
  it('should fail with bad data', async function () {
    // No body
    await testRoute(request(), signup).expect(400);

    // Empty fields
    await testRoute(request(), signup)
      .send({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
      })
      .expect(400);
  });

  it('should succeed and allow login', async function () {
    const newUser = generateMock(Auth$UserSchema, { seed: seed + 1 });

    // Should fail here, user does not exist
    await testRoute(request(), login)
      .send({
        username: newUser.username,
        password: newUser.password,
      })
      .expect(401);

    // Create our user, should succeed
    await testRoute(request(), signup).send(newUser).expect(200);

    // Login should work now
    await testRoute(request(), login)
      .send({
        username: newUser.username,
        password: newUser.password,
      })
      .expect(200);
  });
});

describe(testFor(login), () => {
  // Exploring every possible branch here because login is a critical function
  it('should fail because of empty body', function (done) {
    testRoute(request(), login).expect(400, done);
  });

  it('should fail because of invalid body format', function (done) {
    testRoute(request(), login)
      .send({
        not: 'a valid field',
      })
      .expect(400, done);
  });

  it('should fail because of invalid data types', function (done) {
    testRoute(request(), login)
      .send({
        username: 123,
        password: new Date(),
      })
      .expect(400, done);
  });

  it('should fail because of a missing field', function (done) {
    testRoute(request(), login)
      .send({
        username: 'ianyeoh',
      })
      .expect(400, done);
  });

  it('should fail because user does not exist', function (done) {
    testRoute(request(), login)
      .send({
        username: 'user that does not exist',
        password: 'password',
      })
      .expect(401, done);
  });

  it('should succeed and set-cookie session id (secure, http-only, same-site, with expiry)', async function () {
    const response = await testRoute(request(), login).send({
      username: existingUser.username,
      password: existingUser.password,
    });

    const cookies = extractCookies(response);
    const sessionCookie = cookies.find((cookie) => {
      return cookie['id'] != null;
    });

    expect(sessionCookie).to.not.equal(null);

    if (sessionCookie == undefined) return;

    expect(sessionCookie['id']).to.not.equal(null);
    expect(sessionCookie['Expires']).to.not.equal(null);
    expect(sessionCookie['SameSite']).to.equal('Strict');
    expect(sessionCookie['Secure']).to.equal(undefined);
    expect(sessionCookie['HttpOnly']).to.equal(undefined);
  });

  it('should give access to a protected route', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });
    await testRoute(authedRequest, contract.protected.users.getSelf).expect(
      200,
    );
  });
});

describe(testFor(logout), () => {
  // Testing security critical paths in logging out
  it('should fail because not logged in', function (done) {
    testRoute(request(), logout).expect(401, done);
  });

  it('should succeed after logging in', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });
    await testRoute(authedRequest, logout).expect(200);
  });

  it('should fail when logging out twice', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await testRoute(authedRequest, logout).expect(200);
    await testRoute(authedRequest, logout).expect(401);
  });

  it('should prevent access to protected routes after logging in', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await testRoute(authedRequest, logout).expect(200);
    await testRoute(authedRequest, contract.protected.users.getSelf).expect(
      401,
    );
  });
});

describe(testFor(validSession), () => {
  testProtected(validSession);

  it('should succeed when logged in, and fail after logging out', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await testRoute(authedRequest, validSession).expect(200);

    // Logout and test again
    await testRoute(authedRequest, logout).expect(200);
    await testRoute(authedRequest, validSession).expect(401);
  });
});

describe(testFor(getSessions), () => {
  testProtected(getSessions);

  it('should succeed when logged in', async function () {
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await testRoute(authedRequest, getSessions).expect(200);
  });
});
