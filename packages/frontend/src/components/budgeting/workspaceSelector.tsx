"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tsr } from "@/lib/tsrQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { showConnectionError, showErrorToast } from "@/lib/errorToast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { ChevronDown, UserRoundPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import NewWorkspaceDialog from "./newWorkspaceDialog";

export default function WorkspaceSelector({
  redirectOnSelect = true,
  value,
  onValueChange,
  defaultValue,
}: {
  redirectOnSelect?: boolean;
  value?: string;
  onValueChange?: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
}) {
  const router = useRouter();
  const { isPending, data, error } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  const [internalState, setInternalState] = useState<string>(defaultValue ?? "");

  /* Optionally controlled component logic */
  const isControlled = value !== undefined && onValueChange !== undefined;
  const selectedWorkspace = isControlled ? value : internalState;
  const onSelectedWorkspaceChange = isControlled ? onValueChange : setInternalState;

  /* Handle loading and error states while data in-transit */
  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (error) {
    if (isFetchError(error)) {
      showConnectionError();
    } else if (error.status === 401) {
      showErrorToast("user", 401, error.body);
      router.push("/login");
    } else {
      showErrorToast("user", error.status, error.body);
    }

    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  const workspaces = data.body.workspaces;
  const workspace = workspaces.find(({ workspaceId }) => selectedWorkspace === String(workspaceId));
  const workspaceName = workspace?.name;

  /*
   * If somehow our selected value is a value that isn't a valid workspace, deselect it.
   * Could happen if the user accesses an invalid workspace via the url.
   */
  if (internalState !== "" && !workspaces.some((workspace) => workspace.workspaceId === parseInt(internalState))) {
    onSelectedWorkspaceChange("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] p-0">
          <div
            className={cn(
              "flex w-full h-full items-center px-3",
              selectedWorkspace === "" ? "text-muted-foreground" : "text-foreground",
            )}
          >
            <span className="truncate">{workspaceName ?? "Select workspace"}</span>
            <div className="grow"></div>
            <ChevronDown />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0" align="start">
        <div className="p-3 border-b border-border flex flex-col">
          <DropdownMenuLabel className="font-semibold p-0">
            {workspaces.length === 0 ? "No workspaces found" : (workspaceName ?? "Select a workspace")}
          </DropdownMenuLabel>
          {workspace && (
            <>
              <DropdownMenuLabel className="p-0 text-muted-foreground text-xs">
                {`Your workspace • ${workspace.users.length} member${workspace.users.length > 1 ? "s" : ""}`}
              </DropdownMenuLabel>
              <div className="flex mt-2 gap-1">
                <Button variant="outline" className="text-xs p-0 h-fit text-muted-foreground">
                  <div className="flex gap-1 px-2 py-1 items-center">
                    <Settings />
                    Settings
                  </div>
                </Button>
                <Button variant="outline" className="text-xs p-0 h-fit text-muted-foreground">
                  <div className="flex gap-1 px-2 py-1 items-center">
                    <UserRoundPlus />
                    Invite members
                  </div>
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="border-b border-border p-1 gap-1">
          {workspaces.length !== 0 && (
            <>
              <DropdownMenuGroup>
                {workspaces.map(({ name, workspaceId }) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={name}
                      checked={selectedWorkspace === String(workspaceId)}
                      onCheckedChange={() => {
                        const value = String(workspaceId);
                        onSelectedWorkspaceChange(value);
                        if (redirectOnSelect) {
                          router.push(`/app/budgeting/workspaces/${value}`);
                        }
                      }}
                    >
                      {name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuGroup>
            </>
          )}
        </div>
        <div className="p-1 gap-1">
          <DropdownMenuItem className="text-xs font-semibold text-muted-foreground">
            Create a new workspace
          </DropdownMenuItem>
          <NewWorkspaceDialog />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
