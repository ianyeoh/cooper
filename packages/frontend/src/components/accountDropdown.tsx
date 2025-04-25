"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LogoutButton from "@/components/buttons/logoutBtn";
import { initials } from "@/lib/utils";
import { tsr } from "@/lib/tsr-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDropdown() {
  const { isLoading, data } = tsr.protected.budgeting.workspaces.getWorkspaces.useQuery({
    queryKey: ["user"],
  });

  if (isLoading) {
    return <Skeleton className="h-12 w-12 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{initials(`${data.user.firstName} ${data.user.lastName}`)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <LogoutButton as="dropdownMenuItem" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
