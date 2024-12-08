import { Metadata } from "next";
import { NavBarItem } from "@/components/navbars/navBar";
import { Wallet } from "lucide-react";
import Header from "@/components/navbars/header";

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
        display: "budgeting",
        url: "/app/budgeting/dashboard",
    };
    const logo = <Wallet strokeWidth={1.4} />;
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
            <Header header={header} links={links} logo={logo} />
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
