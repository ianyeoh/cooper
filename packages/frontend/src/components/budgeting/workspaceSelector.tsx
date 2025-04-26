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
import { showErrorToast } from "@/lib/errorToast";

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
  const { isLoading, isError, data } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  const [internalState, setInternalState] = useState<string>(defaultValue ?? "");

  /* Optionally controlled component*/
  const isControlled = value !== undefined && onValueChange !== undefined;

  const selectedWorkspace = isControlled ? value : internalState;
  const onSelectedWorkspaceChange = isControlled ? onValueChange : setInternalState;

  function handleSelect(value: string) {
    onSelectedWorkspaceChange(`/app/budgeting/workspaces/${value}`);

    if (redirectOnSelect) {
      router.push(`/app/budgeting/workspaces/${value}`);
    }
  }

  if (isLoading) {
    return <Skeleton className="h-4 w-[180px]" />;
  }

  if (isError || data?.status !== 200) {
    showErrorToast("workspaces", data?.status ?? 500);
    return <Skeleton className="h-4 w-[180px]" />;
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
