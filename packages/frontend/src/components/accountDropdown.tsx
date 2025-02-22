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
import { fetch } from "@/lib/ts-rest-server";
import { redirect } from "next/navigation";

async function getUserProfile() {
    const response = await fetch.protected.users.getSelf();

    if (response.status === 200) {
        return response.body;
    } else {
        redirect("/login");
    }
}

export default async function AccountDropdown() {
    const userProfile = await getUserProfile();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
                <Avatar>
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback>
                        {initials(
                            `${userProfile.firstName} ${userProfile.lastName}`
                        )}
                    </AvatarFallback>
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
