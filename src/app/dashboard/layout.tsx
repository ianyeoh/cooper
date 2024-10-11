import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartColumn } from "lucide-react";
import LogoutButton from "@/components/logoutBtn";
import ThemeBtn from "@/components/themeBtn";
import { UserProfileType } from "@/lib/schemas/get/user";
import { initials } from "@/lib/utils";
import Session from "@/lib/schemas/db/sessions";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/searchBar";
import MobileNavBar from "@/components/mobileNavBar";

export const metadata: Metadata = {
    title: "budgeting - Dashboard",
    description: "Custom expense tracking solution",
};

async function getUserProfile(): Promise<UserProfileType> {
    const cookieStore = cookies();

    const sessionId = cookieStore.get("id");
    if (!sessionId) {
        redirect("/login");
    }

    const session = await Session.findOne({ _id: sessionId.value });
    if (!session) {
        redirect("/login");
    }

    return session;
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userProfile = await getUserProfile();

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background">
            <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    {/* Shows only on wide screens (desktop) */}
                    <div className="mr-8 hidden md:flex">
                        <div className="flex space-x-3 items-center">
                            <Link
                                href="/dashboard"
                                className="mr-4 flex items-center space-x-3 lg:mr-6"
                            >
                                <ChartColumn strokeWidth={1.5} size={18} />
                                <h1 className="hidden font-bold lg:inline-block">
                                    budgeting
                                </h1>
                            </Link>
                        </div>

                        <nav className="flex items-center gap-4 text-sm lg:gap-6">
                            <Link
                                href="/dashboard/transactions"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Transactions
                            </Link>
                        </nav>
                    </div>

                    {/* Shows only on smaller screens (mobile) */}
                    <MobileNavBar />

                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <SearchBar />
                        <nav className="flex items-center">
                            <ThemeBtn variant="ghost" />
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full">
                                    <Avatar>
                                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                        <AvatarFallback>
                                            {userProfile.username}
                                            {/* {initials(userProfile.username)} */}
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
