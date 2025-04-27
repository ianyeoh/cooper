"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tsr } from "@/lib/tsrQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { showConnectionError, showErrorToast } from "@/lib/errorToast";
import { isFetchError } from "@ts-rest/react-query/v5";

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

  function handleSelect(value: string) {
    onSelectedWorkspaceChange(value);

    if (redirectOnSelect) {
      router.push(`/app/budgeting/workspaces/${value}`);
    }
  }

  /* Handle loading and error states while data in-transit */
  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (error) {
    if (isFetchError(error)) {
      showConnectionError();
    } else if (error.status === 401) {
      router.push("/login");
    } else {
      showErrorToast("user", error.status, error.body);
    }

    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  /*
   * If somehow our selected value is a value that isn't a valid workspace, deselect it.
   * Could happen if the user accesses an invalid workspace via the url.
   */
  if (
    internalState !== "" &&
    data &&
    !data.body.workspaces.some((workspace) => workspace.workspaceId === parseInt(internalState))
  ) {
    onSelectedWorkspaceChange("");
  }

  return (
    <Select value={selectedWorkspace} onValueChange={handleSelect} defaultValue={selectedWorkspace}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your workspaces</SelectLabel>
          {data?.body.workspaces.map(({ name, workspaceId }) => {
            return (
              <SelectItem key={name} value={String(workspaceId)}>
                {name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
