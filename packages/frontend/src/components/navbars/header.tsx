"use client";

import MobileNavBar from "@/components/navbars/mobileNavBar";
import NavBar, { NavBarProps } from "@/components/navbars/navBar";
import AccountDropdown from "@/components/accountDropdown";
import ThemeBtn from "@/components/theming/themeBtn";
import SearchBar from "@/components/ui/searchBar";
import { usePathname } from "next/navigation";
import { SquareTerminal } from "lucide-react";
import WorkspaceSelector from "@/components/budgeting/workspaceSelector";
import { tsr } from "@/lib/tsrQuery";

export default function Header({
  userResponse,
  workspacesResponse,
}: {
  userResponse: {
    status: 200;
    body: {
      user: {
        username: string;
        firstName: string;
        lastName: string;
      };
    };
    headers: Headers;
  };
  workspacesResponse: {
    status: 200;
    body: {
      workspaces: {
        users: string[];
        workspaceId: number;
        name: string;
      }[];
    };
    headers: Headers;
  };
}) {
  // Cache initial data that was fetched server side
  tsr.protected.users.getSelf.useQuery({
    queryKey: ["user"],
    initialData: userResponse,
  });
  tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
    initialData: workspacesResponse,
  });

  // Conditionally render the header bar based on page location
  let navBarProps: NavBarProps = {
    header: undefined,
    logo: undefined,
    links: [],
  };
  let showSearchbar: boolean = false;
  let showWorkspaceSelector: boolean = false;
  let workspaceId;

  const pathname = usePathname();
  if (pathname === "/app") {
    navBarProps = {
      header: {
        kind: "link",
        display: "apps",
        url: "/app",
        description: "Central app directory",
      },
      logo: <SquareTerminal strokeWidth={1.3} width={28} />,
      links: [],
    };
  } else if (pathname === "/app/budgeting/workspaces") {
    navBarProps = {
      header: undefined,
      logo: undefined,
      links: [
        {
          kind: "link",
          display: "Back",
          url: "/app",
          description: "Return to the central app directory",
        },
      ],
    };
  } else if (pathname.startsWith("/app/budgeting/workspaces/")) {
    workspaceId = pathname.replace(/^(\/app\/budgeting\/workspaces\/)/, "").split("/")[0];
    navBarProps = {
      header: undefined,
      logo: undefined,
      links: [
        {
          kind: "link",
          display: "Transactions",
          url: `/app/budgeting/workspaces/${workspaceId}/transactions`,
          description: "View, edit and delete your budget transactions",
        },
        {
          kind: "link",
          display: "Accounts",
          url: `/app/budgeting/workspaces/${workspaceId}/accounts`,
          description: "View, edit and delete your accounts",
        },
      ],
    };
    showSearchbar = true;
    showWorkspaceSelector = true;
  }

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center gap-1">
        {showWorkspaceSelector && <WorkspaceSelector defaultValue={workspaceId} />}

        {/* Shows only on wide screens (desktop) */}
        <NavBar {...navBarProps} />

        {/* Shows only on smaller screens (mobile) */}
        <MobileNavBar {...navBarProps} />

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {showSearchbar && <SearchBar />}
          <nav className="flex items-center gap-2">
            <ThemeBtn variant="ghost" />
            <AccountDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
}
