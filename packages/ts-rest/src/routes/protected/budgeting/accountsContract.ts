import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { Budgeting$AccountSchema } from '@cooper/ts-rest/src/types';

const c = initContract();

const accountsContract = c.router(
  {
    getAccounts: {
      method: 'GET',
      path: '/',
      responses: {
        200: z.object({
          accounts: z.array(Budgeting$AccountSchema),
        }),
      },
      summary: 'Get list of accounts',
    },
    newAccount: {
      method: 'POST',
      path: '/',
      body: Budgeting$AccountSchema.omit({
        accountId: true,
        workspace: true,
        createdBy: true,
      }),
      responses: {
        200: z.object({
          message: z.literal('Account created successfully'),
          account: Budgeting$AccountSchema,
        }),
        400: z.object({
          error: z.literal('Invalid input'),
          reason: z.string().min(1),
        }),
      },
      summary: 'Create a new account',
    },
    /*
     * These routes are separated and restricted by accountId
     */
    byId: c.router(
      {
        updateAccount: {
          method: 'POST',
          path: '/',
          body: Budgeting$AccountSchema.omit({
            accountId: true,
            workspace: true,
          }).partial(),
          responses: {
            200: z.object({
              message: z.literal('Account updated successfully'),
            }),
            400: z.object({
              error: z.literal('Invalid input'),
              reason: z.string().min(1),
            }),
          },
          summary: 'Update details for an existing account',
        },
        deleteAccount: {
          method: 'POST',
          path: '/delete',
          body: z.any(),
          responses: {
            200: z.object({
              message: z.literal('Account deleted successfully'),
            }),
          },
          summary: 'Delete an account',
        },
      },
      {
        pathPrefix: '/:accountId',
        pathParams: Budgeting$AccountSchema.pick({
          accountId: true,
        }),
        commonResponses: {
          404: z.object({
            error: z.literal('Account does not exist'),
          }),
        },
        summary: 'Actions taken on existing accounts by account id',
      },
    ),
  },
  {
    pathPrefix: '/accounts',
  },
);

export default accountsContract;
