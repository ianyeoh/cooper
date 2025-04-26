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
import { tsr } from "@/lib/tsrQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast } from "@/lib/errorToast";

export default function AccountDropdown() {
  const { isLoading, isError, data } = tsr.protected.users.getSelf.useQuery({
    queryKey: ["user"],
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (isError || data?.status !== 200) {
    showErrorToast("user", data?.status ?? 500);
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{initials(`${data?.body.user.firstName} ${data?.body.user.lastName}`)}</AvatarFallback>
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
