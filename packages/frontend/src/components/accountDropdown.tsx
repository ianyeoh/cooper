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
import { showConnectionError, showErrorToast } from "@/lib/errorToast";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useRouter } from "next/navigation";

export default function AccountDropdown() {
  const router = useRouter();
  const { isPending, data, error } = tsr.protected.users.getSelf.useQuery({
    queryKey: ["user"],
  });

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
