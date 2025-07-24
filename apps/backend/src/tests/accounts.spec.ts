import { expect } from 'chai';
import {
  request,
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  createAccount,
} from '@cooper/backend/src/tests/utils';
import { generateMock } from '@anatine/zod-mock';
import {
  Auth$UserSchema,
  Budgeting$AccountSchema,
} from '@cooper/ts-rest/src/types';
import { seed } from '@cooper/backend/src/tests/mocking';
import { contract } from '@cooper/ts-rest/src/contract';

const { signup } = contract.public.auth;
const { byId: workspaceById } = contract.protected.budgeting.workspaces;
const { getAccounts, newAccount } = workspaceById.accounts;
const { updateAccount, deleteAccount } = workspaceById.accounts.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(getAccounts), () => {
  testProtected(getAccounts);

  it('should return list of accounts successfully', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Get accounts list, should be empty
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts)
      .to.be.an('array')
      .with.lengthOf(0);
  });

  it('should fail when called by another user who not in workspace', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    // Get accounts list with other user, should fail
    await testRoute(otherAuthedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(401);
  });
});

describe(testFor(newAccount), () => {
  testProtected(newAccount);

  it('should create an account successfully', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create a new account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Get accounts list, should contain our new account
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains our new account
      getAccountsResponse.body.accounts.some(
        (account: { accountId: number }) => {
          return account.accountId === createdAccount.accountId;
        },
      ),
    ).to.equal(true);
  });

  it('should fail for user without access to workspace', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    // Try to create new account, should fail
    const createdAccount = generateMock(Budgeting$AccountSchema, { seed });
    await testRoute(otherAuthedRequest, newAccount, {
      workspaceId: createdWorkspace.workspaceId,
    })
      .send({
        description: createdAccount.description,
        name: createdAccount.name,
        bank: createdAccount.bank,
      })
      .expect(401);
  });
});

describe(testFor(updateAccount), () => {
  testProtected(updateAccount);

  it('should fail when account invalid', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Update wrong accountId, should fail
    await testRoute(authedRequest, updateAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId + 1,
    }).expect(404);
  });

  it('should succeed in updating account details', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    const updatedAccount = generateMock(Budgeting$AccountSchema, {
      seed: seed + 1,
    });

    // Update account
    await testRoute(authedRequest, updateAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId,
    })
      .send({
        description: updatedAccount.description,
        name: updatedAccount.name,
        bank: updatedAccount.bank,
      })
      .expect(200);

    // Get accounts list, should show updated account
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains the updated account
      getAccountsResponse.body.accounts.some(
        (account: {
          accountId: number;
          description: string;
          name: string;
          bank: string;
        }) => {
          return (
            account.accountId === createdAccount.accountId &&
            account.name === updatedAccount.name &&
            account.bank === updatedAccount.bank
          );
        },
      ),
    ).to.equal(true);
  });

  it('should not be accessible by another user without access to workspace', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    const updatedAccount = generateMock(Budgeting$AccountSchema, {
      seed: seed + 1,
    });

    // Try to update account with other user
    await testRoute(otherAuthedRequest, updateAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId,
    })
      .send({
        description: updatedAccount.description,
        name: updatedAccount.name,
        bank: updatedAccount.bank,
      })
      .expect(401);
  });
});

describe(testFor(deleteAccount), () => {
  testProtected(deleteAccount);

  it('should fail when account invalid', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Delete wrong accountId, should fail
    await testRoute(authedRequest, deleteAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId + 1,
    }).expect(404);
  });

  it('should succeed in deleting account', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Delete account
    await testRoute(authedRequest, deleteAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId,
    }).expect(200);

    // Get accounts list, should show no accounts
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts)
      .to.be.an('array')
      .with.lengthOf(0);
  });

  it('should not be accessible by another user without workspace permissions', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create account
    const createdAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    // Try to delete account
    await testRoute(otherAuthedRequest, deleteAccount, {
      workspaceId: createdWorkspace.workspaceId,
      accountId: createdAccount.accountId,
    }).expect(401);
  });
});
