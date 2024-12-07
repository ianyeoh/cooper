import Link from "next/link";
import { ReactNode } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export type NavBarLink = {
    display: string;
    url: string;
};

export type NavBarGroup = {
    title: string;
    links: NavBarLink[];
};

export type NavBarItem =
    | (NavBarLink & { kind: "link" })
    | (NavBarGroup & { kind: "group" });

export type NavBarProps = {
    header: NavBarLink;
    logo?: ReactNode;
    links: NavBarItem[];
};

export default function NavBar({ header, logo, links }: NavBarProps) {
    return (
        <div className="mr-8 hidden md:flex">
            <div className="flex space-x-3 items-center">
                <Link
                    href={header.url}
                    className="mr-4 flex items-center space-x-3 lg:mr-6"
                >
                    {logo}
                    <h1 className="hidden font-bold lg:inline-block">
                        {header.display}
                    </h1>
                </Link>
            </div>

            <NavigationMenu>
                <NavigationMenuList>
                    {links.map((item) => {
                        switch (item.kind) {
                            case "group":
                                return (
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-sm">
                                            Item One
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <NavigationMenuLink>
                                                Link
                                            </NavigationMenuLink>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                );
                            case "link":
                                return (
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-sm">
                                            Item One
                                        </NavigationMenuTrigger>
                                    </NavigationMenuItem>
                                );
                        }
                    })}
                </NavigationMenuList>
            </NavigationMenu>

            {/* <nav className="flex items-center gap-4 text-sm lg:gap-6">
                <Link
                    href="/app/budgeting/transactions"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    Transactions
                </Link>
            </nav> */}
        </div>
    );
}
