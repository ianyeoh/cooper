import { redirect } from "next/navigation";
import { fetch } from "@/lib/tsrFetch";
import NewWorkspace from "@/components/budgeting/newWorkspace";

export default async function WorkspacesPage() {
  const { status, body } = await fetch.protected.budgeting.workspaces.getWorkspaces();

  if (status !== 200) {
    redirect("/login");
  }

  if (body.workspaces.length > 0) {
    // If the user has at least one workspace created, go to that.
    redirect(`/app/budgeting/workspaces/${body.workspaces[0].workspaceId}`);
  }

  // Otherwise show a default page to create their first workspace
  return (
    <div className="grow flex h-full justify-center items-center">
      <NewWorkspace />
    </div>
  );
}
