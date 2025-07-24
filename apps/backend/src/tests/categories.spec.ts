import { expect } from 'chai';
import {
  request,
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  createCategory,
} from '@cooper/backend/src/tests/utils';
import { generateMock } from '@anatine/zod-mock';
import {
  Auth$UserSchema,
  Budgeting$CategorySchema,
} from '@cooper/ts-rest/src/types';
import { seed } from '@cooper/backend/src/tests/mocking';
import { contract } from '@cooper/ts-rest/src/contract';

const { signup } = contract.public.auth;
const { byId: workspaceById } = contract.protected.budgeting.workspaces;
const { getCategories, newCategory } = workspaceById.categories;
const { updateCategory, deleteCategory } = workspaceById.categories.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(getCategories), () => {
  testProtected(getCategories);

  it('should return list of categories successfully', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Get categories list, should be empty
    const getCategoriesResponse = await testRoute(
      authedRequest,
      getCategories,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getCategoriesResponse.body.categories)
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

    // Get categories list with other user, should fail
    await testRoute(otherAuthedRequest, getCategories, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(401);
  });
});

describe(testFor(newCategory), () => {
  testProtected(newCategory);

  it('should create a category successfully', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create a new category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Get categories list, should contain our new category
    const getCategoriesResponse = await testRoute(
      authedRequest,
      getCategories,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getCategoriesResponse.body.categories)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains our new category
      getCategoriesResponse.body.categories.some(
        (category: { categoryId: number }) => {
          return category.categoryId === createdCategory.categoryId;
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

    // Try to create new category, should fail
    const createdCategory = generateMock(Budgeting$CategorySchema, { seed });
    await testRoute(otherAuthedRequest, newCategory, {
      workspaceId: createdWorkspace.workspaceId,
    })
      .send({ name: createdCategory.name })
      .expect(401);
  });
});

describe(testFor(updateCategory), () => {
  testProtected(updateCategory);

  it('should fail when category invalid', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Update wrong categoryId, should fail
    await testRoute(authedRequest, updateCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId + 1,
    }).expect(404);
  });

  it('should succeed in updating category details', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    const updatedCategory = generateMock(Budgeting$CategorySchema, {
      seed: seed + 1,
    });

    // Update category
    await testRoute(authedRequest, updateCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId,
    })
      .send({ name: updatedCategory.name })
      .expect(200);

    // Get categories list, should show updated category
    const getCategoriesResponse = await testRoute(
      authedRequest,
      getCategories,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getCategoriesResponse.body.categories)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains the updated category
      getCategoriesResponse.body.categories.some(
        (category: { categoryId: number; name: string }) => {
          return (
            category.categoryId === createdCategory.categoryId &&
            category.name === updatedCategory.name
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

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    const updatedCategory = generateMock(Budgeting$CategorySchema, {
      seed: seed + 1,
    });

    // Try to update category with other user
    await testRoute(otherAuthedRequest, updateCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId,
    })
      .send({ name: updatedCategory.name })
      .expect(401);
  });
});

describe(testFor(deleteCategory), () => {
  testProtected(deleteCategory);

  it('should fail when category invalid', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Delete wrong category, should fail
    await testRoute(authedRequest, deleteCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId + 1,
    }).expect(404);
  });

  it('should succeed in deleting category', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Delete category
    await testRoute(authedRequest, deleteCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId,
    }).expect(200);

    // Get categories list, should show no categories
    const getCategoriesResponse = await testRoute(
      authedRequest,
      getCategories,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getCategoriesResponse.body.categories)
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

    // Create category
    const createdCategory = await createCategory(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$CategorySchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    // Try to delete category
    await testRoute(otherAuthedRequest, deleteCategory, {
      workspaceId: createdWorkspace.workspaceId,
      categoryId: createdCategory.categoryId,
    }).expect(401);
  });
});
