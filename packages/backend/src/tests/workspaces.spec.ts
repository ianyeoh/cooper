import { expect } from "chai";
import {
  request,
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  getUsersWorkspaces,
} from "@cooper/backend/src/tests/utils";
import { generateMock } from "@anatine/zod-mock";
import { Auth$UserSchema } from "@cooper/ts-rest/src/types";
import { seed } from "@cooper/backend/src/tests/mocking";
import { contract } from "@cooper/ts-rest/src/contract";

const { signup } = contract.public.auth;
const { newWorkspace, getWorkspaces } = contract.protected.budgeting.workspaces;
const { updateWorkspace, deleteWorkspace } = contract.protected.budgeting.workspaces.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(newWorkspace), () => {
  testProtected(newWorkspace);

  it("should create a workspace successfully", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await createWorkspace(authedRequest, {
      name: "Workspace",
    });
  });
});

describe(testFor(getWorkspaces), () => {
  testProtected(getWorkspaces);

  it("should successfully return no workspaces", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    await getUsersWorkspaces(authedRequest, {
      size: 0,
    });
  });

  it("should return newly created workspace", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    // Get workspaces, should contain the new workspace
    await getUsersWorkspaces(authedRequest, {
      includes: createdWorkspace.workspaceId,
    });
  });

  it("should only return workspaces you own", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    // Get workspaces, should contain the new workspace
    await getUsersWorkspaces(authedRequest, {
      includes: createdWorkspace.workspaceId,
    });

    // Create other user
    const newUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(newUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: newUser.username,
      password: newUser.password,
    });

    // Create a new workspace
    const otherWorkspace = await createWorkspace(otherAuthedRequest, {
      name: "Workspace",
    });

    // Get workspaces, should contain the new workspace
    await getUsersWorkspaces(otherAuthedRequest, {
      includes: otherWorkspace.workspaceId,
    });
  });
});

describe(testFor(updateWorkspace), () => {
  testProtected(deleteWorkspace);

  it("should fail because workspace not found", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    await testRoute(authedRequest, updateWorkspace, {
      workspaceId: createdWorkspace.workspaceId + 1,
    })
      .send({
        name: "Workspace",
      })
      .expect(404);
  });

  it("should update workspace successfully", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    const oldWorkspaceName = "Workspace";
    const newWorkspaceName = "Updated Workspace Name";

    expect(oldWorkspaceName).to.not.equal(newWorkspaceName);

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: oldWorkspaceName,
    });

    // Update workspace name
    await testRoute(authedRequest, updateWorkspace, {
      workspaceId: createdWorkspace.workspaceId,
    })
      .send({
        name: newWorkspaceName,
      })
      .expect(200);

    // Get workspaces, should contain the new workspace
    const workspaceList = await getUsersWorkspaces(authedRequest, {
      includes: createdWorkspace.workspaceId,
    });

    // Check that workspace name has been changed
    expect(
      workspaceList.some((workspace: { workspaceId: number; name: string }) => {
        return workspace.workspaceId === createdWorkspace.workspaceId && workspace.name === newWorkspaceName;
      }),
    ).to.equal(true);
  });
});

describe(testFor(deleteWorkspace), () => {
  testProtected(deleteWorkspace);

  it("should fail because workspace not found", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    await testRoute(authedRequest, deleteWorkspace, {
      workspaceId: createdWorkspace.workspaceId + 1,
    }).expect(404);
  });

  it("should delete workspace successfully", async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create a new workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: "Workspace",
    });

    // Update workspace name
    await testRoute(authedRequest, deleteWorkspace, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(200);

    // Get workspaces, should not contain the new workspace
    await getUsersWorkspaces(authedRequest, {
      excludes: createdWorkspace.workspaceId,
    });
  });
});
