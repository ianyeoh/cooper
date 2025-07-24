import { expect } from 'chai';
import {
  request,
  authenticate,
  testFor,
  testRoute,
  testProtected,
  createWorkspace,
  createTransaction,
  createAccount,
} from '@cooper/backend/src/tests/utils';
import { generateMock } from '@anatine/zod-mock';
import {
  Auth$UserSchema,
  Budgeting$AccountSchema,
  Budgeting$TransactionSchema,
} from '@cooper/ts-rest/src/types';
import { seed } from '@cooper/backend/src/tests/mocking';
import { contract } from '@cooper/ts-rest/src/contract';

const { signup } = contract.public.auth;
const { byId: workspaceById } = contract.protected.budgeting.workspaces;
const { getTransactions, newTransaction } = workspaceById.transactions;
const { updateTransaction, deleteTransaction } =
  workspaceById.transactions.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(getTransactions), () => {
  testProtected(getTransactions);

  it('should return list of transactions successfully', async function () {
    // Login
    const authedRequest = await authenticate({
      username: existingUser.username,
      password: existingUser.password,
    });

    // Create workspace
    const createdWorkspace = await createWorkspace(authedRequest, {
      name: 'Workspace',
    });

    // Get transactions list, should be empty
    const getTransactionsResponse = await testRoute(
      authedRequest,
      getTransactions,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getTransactionsResponse.body.transactions)
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

    // Get transactions list with other user, should fail
    await testRoute(otherAuthedRequest, getTransactions, {
      workspaceId: createdWorkspace.workspaceId,
    }).expect(401);
  });
});

describe(testFor(newTransaction), () => {
  testProtected(newTransaction);

  it('should create a transaction successfully', async function () {
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

    // Create a new transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Get transactions list, should contain our new transaction
    const getTransactionsResponse = await testRoute(
      authedRequest,
      getTransactions,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getTransactionsResponse.body.transactions)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains our new transaction
      getTransactionsResponse.body.transactions.some(
        (transaction: { transactionId: number }) => {
          return transaction.transactionId === createdTransaction.transactionId;
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

    // Try to create new transaction, should fail
    const createdTransaction = generateMock(Budgeting$TransactionSchema, {
      seed,
    });
    await testRoute(otherAuthedRequest, newTransaction, {
      workspaceId: createdWorkspace.workspaceId,
    })
      .send({
        account: createdAccount.accountId,
        date: createdTransaction.date,
        description: createdTransaction.description,
        category: createdTransaction.category,
        amount: createdTransaction.amount,
        comments: createdTransaction.comments,
      })
      .expect(401);
  });
});

describe(testFor(updateTransaction), () => {
  testProtected(updateTransaction);

  it('should fail when transaction invalid', async function () {
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Update wrong transactionId, should fail
    await testRoute(authedRequest, updateTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId + 1,
    }).expect(404);
  });

  it('should succeed in updating transaction details', async function () {
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Create another account
    const updatedAccount = await createAccount(
      authedRequest,
      createdWorkspace.workspaceId,
      generateMock(Budgeting$AccountSchema, { seed }),
    );

    const updatedTransaction = generateMock(Budgeting$TransactionSchema, {
      seed: seed + 1,
    });

    // Update transaction
    await testRoute(authedRequest, updateTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId,
    })
      .send({
        account: updatedAccount.accountId,
        date: updatedTransaction.date,
        description: updatedTransaction.description,
        category: updatedTransaction.category,
        amount: updatedTransaction.amount,
        comments: updatedTransaction.comments,
      })
      .expect(200);

    // Get transactions list, should show updated transaction
    const getTransactionsResponse = await testRoute(
      authedRequest,
      getTransactions,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getTransactionsResponse.body.transactions)
      .to.be.an('array')
      .with.lengthOf(1);
    expect(
      // That the array contains the updated transaction
      getTransactionsResponse.body.transactions.some(
        (transaction: {
          transactionId: number;
          account: string;
          date: Date;
          description: string;
          category: string;
          amount: number;
          comments: string;
        }) => {
          return (
            transaction.transactionId === createdTransaction.transactionId &&
            transaction.account === updatedAccount.accountId &&
            new Date(transaction.date).getTime() ===
              new Date(updatedTransaction.date).getTime() &&
            transaction.description === updatedTransaction.description &&
            transaction.category === updatedTransaction.category &&
            transaction.amount === updatedTransaction.amount &&
            transaction.comments === updatedTransaction.comments
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    const updatedTransaction = generateMock(Budgeting$TransactionSchema, {
      seed: seed + 1,
    });

    // Try to update transaction with other user
    await testRoute(otherAuthedRequest, updateTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId,
    })
      .send({
        date: updatedTransaction.date,
        description: updatedTransaction.description,
        category: updatedTransaction.category,
        amount: updatedTransaction.amount,
        comments: updatedTransaction.comments,
      })
      .expect(401);
  });
});

describe(testFor(deleteTransaction), () => {
  testProtected(deleteTransaction);

  it('should fail when transaction invalid', async function () {
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Delete wrong transaction, should fail
    await testRoute(authedRequest, deleteTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId + 1,
    }).expect(404);
  });

  it('should succeed in deleting transaction', async function () {
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Delete transaction
    await testRoute(authedRequest, deleteTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId,
    }).expect(200);

    // Get transactions list, should show no transactions
    const getTransactionsResponse = await testRoute(
      authedRequest,
      getTransactions,
      {
        workspaceId: createdWorkspace.workspaceId,
      },
    ).expect(200);

    expect(getTransactionsResponse.body.transactions)
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

    // Create transaction
    const createdTransaction = await createTransaction(
      authedRequest,
      createdWorkspace.workspaceId,
      createdAccount.accountId,
      generateMock(Budgeting$TransactionSchema, { seed }),
    );

    // Create other user
    const otherUser = generateMock(Auth$UserSchema, { seed: seed + 1 });
    await testRoute(request(), signup).send(otherUser).expect(200);

    // Login with other user
    const otherAuthedRequest = await authenticate({
      username: otherUser.username,
      password: otherUser.password,
    });

    // Try to delete transaction
    await testRoute(otherAuthedRequest, deleteTransaction, {
      workspaceId: createdWorkspace.workspaceId,
      transactionId: createdTransaction.transactionId,
    }).expect(401);
  });
});
