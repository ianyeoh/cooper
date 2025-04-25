"use client";

import { contract } from "@cooper/ts-rest/src/contract";
import { ClientInferRequest } from "@ts-rest/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceForm } from "@/components/forms/workspaceForm";
import { toast } from "sonner";
import { parseError } from "@cooper/ts-rest/src/utils";
import { useRouter } from "next/navigation";
import { tsr } from "@/lib/tsr-query";

export default function NewWorkspaceCard() {
  const router = useRouter();
  const { mutate } = tsr.protected.budgeting.workspaces.newWorkspace.useMutation();

  function handleCreateWorkspace(
    body: ClientInferRequest<typeof contract.protected.budgeting.workspaces.newWorkspace>["body"],
  ) {
    return new Promise<void>((resolve, reject) => {
      mutate(
        { body },
        {
          onSuccess: async ({ body }) => {
            router.push(`/app/budgeting/workspaces/${body.workspace.workspaceId}`);
            router.refresh();
            resolve();
          },
          onError: async (e) => {
            let errMsg = "Failed to create new workspace, please try again later.";

            const error = parseError(e);
            if (error.isKnownError) {
              errMsg = `${error.errMsg}`;
            } else {
              console.log(`Unknown error: ${JSON.stringify(e)}`);
            }

            toast.error(errMsg);
            reject(error);
          },
        },
      );
    });
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create your first workspace</CardTitle>
        <CardDescription>
          A workspace is a collaborative area where you can invite others to view and edit your budgets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkspaceForm onSubmit={handleCreateWorkspace} />
      </CardContent>
    </Card>
  );
}
