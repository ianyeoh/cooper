"use client";

import { redirect, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { tsr } from "@/lib/tsr-query";

export default function WorkspaceSelector() {
  const pathname = usePathname();

  if (!pathname.startsWith("/app/budgeting/workspaces/")) {
    throw new Error(
      "Workspace selector not used in valid path. Is this component being rendered outside of the route /app/budgeting/workspaces/*?",
    );
  }

  const workspaceId = pathname.replace(/^(\/app\/budgeting\/workspaces\/)/, "").split("/")[0];

  const { data, isPending } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["workspaces"],
  });

  if (isPending) {
    return (
      <div className="flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 shadow-sm ring-offset-background">
        <Skeleton className="h-4 w-[150px]" />
      </div>
    );
  }

  if (data?.status !== 200) {
    return;
  }

  return (
    <Select
      onValueChange={(value: string) => {
        redirect(`/app/budgeting/workspaces/${value}`);
      }}
      defaultValue={workspaceId}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your workspaces</SelectLabel>
          {data.body.workspaces.map(({ name, workspaceId }) => {
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
