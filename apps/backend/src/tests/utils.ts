import { default as supertestRequest } from 'supertest';
import app from '@cooper/backend/src/server';
import TestAgent from 'supertest/lib/agent';
import Test from 'supertest/lib/test';
import { expect } from 'chai';
import { contract } from '@cooper/ts-rest/src/contract';
import {
  Budgeting$Account,
  Budgeting$Category,
  Budgeting$Transaction,
} from '@cooper/ts-rest/src/types';

/**
 * Factory to create supertest object with our backend Express app
 */
const request = function () {
  return supertestRequest(app);
};

/**
 * Factory to create an authed supertest object factory,
 * where cookies are persisted with subsequent requests
 */
const authenticate = async function ({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const newAuthedRequest = supertestRequest.agent(app);

  // Login
  const response = await newAuthedRequest.post('/api/auth/login').send({
    username,
    password,
  });

  // Put the sessionId cookie in the cookie jar for subsequent requests
  const cookies = extractCookies(response);
  newAuthedRequest.jar.setCookie(`id=${cookies[0]['id']}`);

  return newAuthedRequest;
};

/**
 * Extracts the set-cookie header on a supertest response
 * @param response Supertest response object
 * @returns Object containing cookie fields, keys are strings, values are strings or undefined
 */
function extractCookies(response: { headers: { [key: string]: string } }): {
  [key: string]: string;
}[] {
  if (!('set-cookie' in response.headers))
    throw new Error('Set-Cookie not in response headers');

  const cookies = Object.values(response.headers['set-cookie']).map(
    (cookieStr: string) => {
      return cookieStr.split('; ').reduce((obj, item) => {
        const [key, value] = item.split('=');
        obj[key] = value;
        return obj;
      }, {});
    },
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
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
    path: string;
  },
  args?: {
    [key: string]: string;
  },
): Test {
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

/**
 * Ensures route cannot be accessed by an unauthenticated session
 * @param route ts-rest route to be tested
 * @returns Fully configured mocha unit test
 */
function testProtected(route: {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  path: string;
}) {
  return it('should fail because not logged in', function (done) {
    testRoute(request(), route).expect(401, done);
  });
}

async function createWorkspace(
  authedRequest: TestAgent<Test>,
  workspace: {
    name: string;
  },
) {
  const { newWorkspace } = contract.protected.budgeting.workspaces;

  // Create workspace
  const response = await testRoute(authedRequest, newWorkspace)
    .send(workspace)
    .expect(200);

  // Basic generic validation
  expect(response.body.workspace).to.contain.keys('workspaceId');

  return response.body.workspace;
}

async function getUsersWorkspaces(
  authedRequest: TestAgent<Test>,
  opts?: {
    size?: number;
    includes?: number;
    excludes?: number;
  },
) {
  const { getWorkspaces } = contract.protected.budgeting.workspaces;

  const response = await testRoute(authedRequest, getWorkspaces).expect(200);

  // Basic generic validation
  expect(response.body.workspaces).to.be.an('array');

  if (opts) {
    // That the array contains opts.size number of workspaces
    if (opts.size) {
      expect(response.body.workspaces).to.have.lengthOf(opts.size);
    }

    // That the array contains the workspace with matching workspaceId
    if (opts.includes) {
      expect(
        response.body.workspaces.some((workspace: { workspaceId: number }) => {
          return workspace.workspaceId === opts.includes;
        }),
      ).to.equal(true);
    }

    // That the array does not contain an account with workspaceId
    if (opts.excludes) {
      expect(
        response.body.workspaces.some((workspace: { workspaceId: number }) => {
          return workspace.workspaceId === opts.excludes;
        }),
      ).to.equal(false);
    }
  }

  return response.body.workspaces;
}

async function createAccount(
  authedRequest: TestAgent<Test>,
  workspaceId: string,
  account: Budgeting$Account,
) {
  const newAccount =
    contract.protected.budgeting.workspaces.byId.accounts.newAccount;

  const request = await testRoute(authedRequest, newAccount, {
    workspaceId,
  })
    .send({
      description: account.description,
      name: account.name,
      bank: account.bank,
    })
    .expect(200);

  expect(request.body.account).to.deep.include({
    description: account.description,
    name: account.name,
    bank: account.bank,
    workspace: workspaceId,
  });
  expect(request.body.account).to.have.own.property('accountId');

  return request.body.account;
}

async function createCategory(
  authedRequest: TestAgent<Test>,
  workspaceId: string,
  category: Budgeting$Category,
) {
  const newCategory =
    contract.protected.budgeting.workspaces.byId.categories.newCategory;

  const request = await testRoute(authedRequest, newCategory, {
    workspaceId,
  })
    .send({ name: category.name })
    .expect(200);

  expect(request.body.category).to.deep.include({
    name: category.name,
    workspace: workspaceId,
  });
  expect(request.body.category).to.have.own.property('categoryId');

  return request.body.category;
}

async function createTransaction(
  authedRequest: TestAgent<Test>,
  workspaceId: string,
  accountId: string,
  transaction: Budgeting$Transaction,
) {
  const newTransaction =
    contract.protected.budgeting.workspaces.byId.transactions.newTransaction;

  const request = await testRoute(authedRequest, newTransaction, {
    workspaceId,
  })
    .send({
      account: accountId,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      comments: transaction.comments,
    })
    .expect(200);

  expect(request.body.transaction).to.deep.include({
    account: accountId,
    description: transaction.description,
    category: transaction.category,
    amount: transaction.amount,
    comments: transaction.comments,
    workspace: workspaceId,
  });
  expect(request.body.transaction).to.have.own.property('transactionId');

  return request.body.transaction;
}

export {
  extractCookies,
  request,
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  getUsersWorkspaces,
  createAccount,
  createCategory,
  createTransaction,
};
