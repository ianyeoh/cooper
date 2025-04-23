"use client";

import { redirect } from "next/navigation";
import NewWorkspaceCard from "@/components/budgeting/newWorkspaceCard";
import { tsr } from "@/lib/tsr-query";
import { Spinner } from "@/components/ui/spinner";

export default function BudgetingWorkspacePage() {
  const { data, isPending } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  if (isPending) {
    return <Spinner size="large" />;
  }

  if (data?.status !== 200) {
    return redirect("/login");
  }

  // If the user has at least one workspace created, go to that.
  if (data.body.workspaces.length > 0) redirect(`/app/budgeting/workspaces/${data.body.workspaces[0].workspaceId}`);

  // Otherwise show a default page to create their first workspace
  return (
    <div className="grow flex h-full justify-center items-center">
      <NewWorkspaceCard />
    </div>
  );
}
