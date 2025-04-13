import { AppRouteImplementation } from "@ts-rest/express";
import { contract } from "@cooper/ts-rest/src/contract";
import { authenticate } from "@cooper/backend/src/middleware/authenticate";
import { validateWorkspace } from "@cooper/backend/src/middleware/validateWorkspace";
import { validateCategory } from "@cooper/backend/src/middleware/validateCategory";
import guard from "@cooper/backend/src/middleware/guard";

const getCategoriesHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.categories.getCategories
> = async function ({ req, res }) {
  const db = req.app.locals.database;

  const workspaceId = guard(res.workspace).workspaceId;

  const categories = db.budgeting.categories.getWorkspaceCategories(workspaceId);

  return {
    status: 200,
    body: {
      categories,
    },
  };
};
export const getCategories = {
  middleware: [authenticate, validateWorkspace],
  handler: getCategoriesHandler,
};

const newCategoryHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.categories.newCategory
> = async function ({ req, res, body }) {
  const db = req.app.locals.database;

  const workspaceId = guard(res.workspace).workspaceId;
  const { name, createdBy } = body;

  const newCategory = db.budgeting.categories.createCategory(name, createdBy, workspaceId);

  if (newCategory instanceof Error) {
    throw newCategory;
  }

  return {
    status: 200,
    body: {
      message: "Category created successfully",
    },
  };
};
export const newCategory = {
  middleware: [authenticate, validateWorkspace],
  handler: newCategoryHandler,
};

const updateCategoryHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.categories.byId.updateCategory
> = async function ({ req, res, body }) {
  const db = req.app.locals.database;

  const categoryId = guard(res.category).categoryId;
  const { name, createdBy } = body;

  const updatedCategory = db.budgeting.categories.updateCategory(categoryId, name, createdBy);

  if (updatedCategory instanceof Error) {
    throw updatedCategory;
  }

  return {
    status: 200,
    body: {
      message: "Category updated successfully",
    },
  };
};
export const updateCategory = {
  middleware: [authenticate, validateWorkspace, validateCategory],
  handler: updateCategoryHandler,
};

const deleteCategoryHandler: AppRouteImplementation<
  typeof contract.protected.budgeting.workspaces.byId.categories.byId.deleteCategory
> = async function ({ req, res }) {
  const db = req.app.locals.database;

  const categoryId = guard(res.category).categoryId;

  db.budgeting.categories.deleteCategory(categoryId);

  return {
    status: 200,
    body: {
      message: "Category deleted successfully",
    },
  };
};
export const deleteCategory = {
  middleware: [authenticate, validateWorkspace, validateCategory],
  handler: deleteCategoryHandler,
};
