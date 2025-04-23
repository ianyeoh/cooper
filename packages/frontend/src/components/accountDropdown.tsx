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
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDropdown() {
  const { data, isPending } = tsr.protected.users.getSelf.useQuery({
    queryKey: ["selfUserProfile"],
  });

  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (data?.status !== 200) {
    return redirect("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{initials(`${data.body.user.firstName} ${data.body.user.lastName}`)}</AvatarFallback>
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
