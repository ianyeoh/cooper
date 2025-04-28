"use client";

import { tsr } from "@/lib/tsrQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { showConnectionError, showErrorToast } from "@/lib/errorToast";
import ResourceNotFound from "@/components/resourceNotFound";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useRouter } from "next/navigation";

export default function BudgetingDashboard({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const { isPending, data, error } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  /* Handle loading and error states while data in-transit */
  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (error) {
    if (isFetchError(error)) {
      showConnectionError();
    } else if (error.status === 401) {
      showErrorToast("workspaces", 401, error.body);
      router.push("/login");
    } else {
      showErrorToast("workspaces", error.status, error.body);
    }

    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  /* Invalid workspace */
  if (!data?.body.workspaces.some((workspace) => workspace.workspaceId === parseInt(workspaceId))) {
    return (
      <div className="grow h-full">
        <ResourceNotFound />
      </div>
    );
  }

  return <div></div>;
}
