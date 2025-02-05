import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { Budgeting$Category, Budgeting$CategorySchema } from "../../../types";

const c = initContract();

const categoriesContract = c.router(
    {
        getCategories: {
            method: "GET",
            path: "/",
            responses: {
                200: c.type<Budgeting$Category[]>(),
            },
            summary: "Get a list of categories",
        },
        newCategory: {
            method: "POST",
            path: "/",
            body: Budgeting$CategorySchema.omit({
                categoryId: true,
                workspace: true,
            }),
            responses: {
                200: z.literal("Category created successfully"),
                400: z.object({
                    error: z.literal("Invalid input"),
                    reason: z.string().min(1),
                }),
            },
            summary: "Create a new category",
        },
        /*
         * These routes are separated and restricted by categoryId
         */
        byId: c.router(
            {
                updateCategory: {
                    method: "POST",
                    path: "/",
                    body: Budgeting$CategorySchema.omit({
                        categoryId: true,
                    }).partial(),
                    responses: {
                        200: z.literal("Category updated successfully"),
                        400: z.object({
                            error: z.literal("Invalid input"),
                            reason: z.string().min(1),
                        }),
                    },
                    summary: "Update a category by id",
                },
                deleteCategory: {
                    method: "POST",
                    path: "/delete",
                    body: z.any(),
                    responses: {
                        200: z.literal("Category updated successfully"),
                    },
                    summary: "Delete a category by id",
                },
            },
            {
                pathPrefix: "/:categoryId",
                pathParams: Budgeting$CategorySchema.pick({
                    categoryId: true,
                }),
                commonResponses: {
                    404: z.object({
                        error: z.literal("Category does not exist"),
                    }),
                },
            }
        ),
    },
    {
        pathPrefix: "/categories",
    }
);

export default categoriesContract;
