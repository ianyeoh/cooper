"use client";

import { tsr } from "@/lib/tsr-query";
import { notFound, redirect } from "next/navigation";

export default function BudgetingDashboard({ workspaceId }: { workspaceId: string }) {
  const { data, isPending } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  // if (isPending) {
  //   return (
  //     <div className="flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 shadow-sm ring-offset-background">
  //     </div>
  //   );
  // }

  if (data?.status !== 200) {
    return;
  }

  const workspace = data.body.workspaces.find((item) => {
    return item.workspaceId === parseInt(workspaceId);
  });

  if (!workspace) {
    return notFound();
  }
}
