import { request, testRoute } from '@cooper/backend/src/tests/utils';
import { generateMock } from '@anatine/zod-mock';
import { Auth$UserSchema } from '@cooper/ts-rest/src/types';
import { seed } from '@cooper/backend/src/tests/mocking';
import { contract } from '@cooper/ts-rest/src/contract';

export const mochaHooks = {
  // Runs before every test in every file
  beforeEach: async function () {
    await request().get('/testing/reset').expect(200);

    // Create a new initial user for use in tests on protected routes
    // Simplifies other tests by removing need to do this step
    const mockUser = generateMock(Auth$UserSchema, { seed });
    await testRoute(request(), contract.public.auth.signup)
      .send(mockUser)
      .expect(200);
  },
};
