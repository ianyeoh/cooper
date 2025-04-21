import { fetch } from "@/lib/tsr-fetch";
import { ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";
import { redirect } from "next/navigation";
import NewWorkspaceCard from "@/components/budgeting/newWorkspaceCard";
import Header from "@/components/navbars/header";
import { NavBarItem } from "@/components/navbars/navBar";

// Function executed server side to get user's workspaces
async function getWorkspaces(): Promise<
  ClientInferResponseBody<typeof contract.protected.budgeting.workspaces.getWorkspaces, 200>["workspaces"]
> {
  const response = await fetch.protected.budgeting.workspaces.getWorkspaces();

  if (response.status === 200) {
    return response.body.workspaces;
  } else {
    redirect("/login");
  }
}

export default async function BudgetingWorkspacePage() {
  const links: NavBarItem[] = [
    {
      kind: "link",
      display: "Back",
      url: "/app",
      description: "Return to the main app directory",
    },
  ];

  // If the user has at least one workspace created, go to that.
  const workspaces = await getWorkspaces();
  if (workspaces.length > 0) redirect(`/app/budgeting/workspaces/${workspaces[0].workspaceId}`);

  // Otherwise show a default page to create their first workspace
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <Header links={links} searchBar={false} />
      <main className="flex-1 border-b flex items-stretch">
        <div className="grow flex justify-center py-6 md:py-0">
          <div className="container flex max-w-screen-2xl items-center break-words">
            <div className="grow flex justify-center">
              <NewWorkspaceCard />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div className="flex justify-center py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Ian Yeoh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
