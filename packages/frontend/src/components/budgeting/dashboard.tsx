"use client";

import { tsr } from "@/lib/tsrQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast } from "@/lib/errorToast";
import ResourceNotFound from "@/components/resourceNotFound";

export default function BudgetingDashboard({ workspaceId }: { workspaceId: string }) {
  const { isLoading, isError, data } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  if (isLoading) {
    return;
  }

  if (isError || data?.status !== 200) {
    showErrorToast("workspaces", data?.status ?? 500);
    return;
  }

  // Invalid WorkspaceId
  if (!data?.body.workspaces.some((workspace) => workspace.workspaceId === parseInt(workspaceId))) {
    return (
      <div className="grow h-full">
        <ResourceNotFound />
      </div>
    );
  }

  return <div></div>;
}
