import { Metadata } from "next";

import MobileNavBar from "@/components/navbars/mobileNavBar";
import NavBar, { NavBarItem } from "@/components/navbars/navBar";
import AccountDropdown from "@/components/accountDropdown";
import ThemeBtn from "@/components/theming/themeBtn";
import SearchBar from "@/components/searchBar";

export const metadata: Metadata = {
    title: "budgeting - Dashboard",
    description: "Custom expense tracking solution",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const header = {
        kind: "link",
        display: "cooper/budgeting",
        url: "/app/budgeting/dashboard",
    };

    const links: NavBarItem[] = [
        {
            kind: "group",
            title: "Core",
            links: [
                {
                    display: "Transactions",
                    url: "/app/budgeting/transactions",
                    description:
                        "View, edit and delete your budget transactions",
                },
                {
                    display: "Accounts",
                    url: "/app/budgeting/accounts",
                    description: "View, edit and delete your accounts",
                },
                {
                    display: "Expenses",
                    url: "/app/budgeting/expenses",
                    description: "View, edit and delete your expenses",
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
                            <AccountDropdown />
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
