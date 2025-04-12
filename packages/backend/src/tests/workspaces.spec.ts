import { expect } from "chai";
import {
    request,
    authenticate,
    testFor,
    testRoute,
    testProtected,
} from "@cooper/backend/src/tests/utils";
import { generateMock } from "@anatine/zod-mock";
import { Auth$UserSchema } from "@cooper/ts-rest/src/types";
import { seed } from "@cooper/backend/src/tests/mocking";
import { contract } from "@cooper/ts-rest/src/contract";

const { newWorkspace, getWorkspaces } = contract.protected.budgeting.workspaces;
const { updateWorkspace, deleteWorkspace } =
    contract.protected.budgeting.workspaces.byId;

const existingUser = generateMock(Auth$UserSchema, { seed });

describe(testFor(newWorkspace), () => {
    testProtected(newWorkspace);

    it("should return our own user data", async function () {
        // Login
        const authedRequest = await authenticate({
            username: existingUser.username,
            password: existingUser.password,
        });

        // Get self
        const response = await testRoute(authedRequest, getSelf).expect(200);

        expect(response.body.user).to.deep.equal({
            username: existingUser.username,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        });
    });
});
