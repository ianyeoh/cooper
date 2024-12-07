import { Metadata } from "next";
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
import ThemeBtn from "@/components/theming/themeBtn";
import SearchBar from "@/components/searchBar";
import MobileNavBar from "@/components/navbars/mobileNavBar";
import { fetch } from "@/lib/ts-rest-server";
import { redirect } from "next/navigation";
import { initials } from "@/lib/utils";
import NavBar, { NavBarItem } from "@/components/navbars/navBar";

export const metadata: Metadata = {
    title: "budgeting - Dashboard",
    description: "Custom expense tracking solution",
};

async function getUserProfile() {
    const response = await fetch.users.getUserProfile();

    if (response.status === 200) {
        return response.body;
    } else {
        redirect("/login");
    }
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userProfile = await getUserProfile();

    const header = {
        kind: "link",
        display: "cooper/budgeting",
        url: "/app/budgeting/dashboard",
    };

    const links: NavBarItem[] = [
        {
            kind: "link",
            display: "Home",
            url: "/app/",
        },
        {
            kind: "group",
            title: "Core",
            links: [
                {
                    display: "Transactions",
                    url: "/app/budgeting/transactions",
                },
                {
                    display: "Accounts",
                    url: "/app/budgeting/transactions",
                },
                {
                    display: "Expenses",
                    url: "/app/budgeting/transactions",
                },
            ],
        },
        {
            kind: "group",
            title: "Settings",
            links: [
                {
                    display: "Account",
                    url: "/app/budgeting/transactions",
                },
                {
                    display: "Roles",
                    url: "/app/budgeting/transactions",
                },
                {
                    display: "Features",
                    url: "/app/budgeting/transactions",
                },
            ],
        },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background">
            <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    {/* Shows only on wide screens (desktop) */}
                    <NavBar header={header} links={links} />

                    {/* Shows only on smaller screens (mobile) */}
                    <MobileNavBar header={header} links={links} />

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <SearchBar />
                        <nav className="flex items-center gap-2">
                            <ThemeBtn variant="ghost" />
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
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <LogoutButton as="dropdownMenuItem" />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1 border-b">
                <div className="flex justify-center py-6 md:py-0">
                    <div className="container flex max-w-screen-2xl items-center break-words">
                        {children}
                    </div>
                </div>
            </main>
            <footer>
                <div className="flex justify-center py-6 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl">
                        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                            Built by Ian Yeoh.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
