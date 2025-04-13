import { expect } from "chai";
import {
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  createAccount,
} from "@cooper/backend/src/tests/utils";
import { generateMock } from "@anatine/zod-mock";
import { Auth$UserSchema, Budgeting$AccountSchema } from "@cooper/ts-rest/src/types";
import { seed } from "@cooper/backend/src/tests/mocking";
import { contract } from "@cooper/ts-rest/src/contract";

const { byId: workspaceById } = contract.protected.budgeting.workspaces;
const { getAccounts, newAccount } = workspaceById.accounts;
const { updateAccount, deleteAccount } = workspaceById.accounts.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(getAccounts), () => {
  testProtected(getAccounts);

  it("should return list of accounts successfully", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    // Get accounts list, should be empty
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts).to.be.an("array").with.lengthOf(0);
  });
});

describe(testFor(newAccount), () => {
  testProtected(newAccount);

  it("should create an account successfully", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
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

    expect(getAccountsResponse.body.accounts).to.be.an("array").with.lengthOf(1);
    expect(
      // That the array contains our new account
      getAccountsResponse.body.accounts.some((account: { accountId: number }) => {
        return account.accountId === createdAccount.accountId;
      }),
    ).to.equal(true);
  });
});

describe(testFor(updateAccount), () => {
  testProtected(updateAccount);

  it("should fail when account invalid", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    // Get accounts list, should be empty
    const getAccountsResponse = await testRoute(authedRequest, getAccounts, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    expect(getAccountsResponse.body.accounts).to.be.an("array").with.lengthOf(0);
  });
});
