import Link from "next/link";
import { ReactNode } from "react";

export type NavBarLink = {
    display: string;
    url: string;
};

export type NavBarGroup = {
    title?: string;
    links: NavBarLink[];
};

export type NavBarProps = {
    header: NavBarLink;
    logo?: ReactNode;
    links: (NavBarGroup | NavBarLink)[];
};

export default function NavBar({ header, logo, links }: NavBarProps) {
    return (
        <div className="mr-8 hidden md:flex">
            <div className="flex space-x-3 items-center">
                <Link
                    href="/dashboard"
                    className="mr-4 flex items-center space-x-3 lg:mr-6"
                >
                    {logo}
                    <h1 className="hidden font-bold lg:inline-block">
                        {header}
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
    );
}
