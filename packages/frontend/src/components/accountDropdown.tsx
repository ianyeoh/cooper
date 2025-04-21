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
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { tsr } from "@/lib/tsr-query";

export default async function AccountDropdown() {
  const tsrQueryClient = tsr.initQueryClient(new QueryClient());

  await tsrQueryClient.protected.users.getSelf.prefetchQuery({ queryKey: ["userProfile"] });

  return (
    <HydrationBoundary state={dehydrate(tsrQueryClient)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{initials(`${userProfile.firstName} ${userProfile.lastName}`)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <LogoutButton as="dropdownMenuItem" />
        </DropdownMenuContent>
      </DropdownMenu>
    </HydrationBoundary>
  );
}
