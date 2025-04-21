"use client";

import Link from "next/link";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigationMenu";
import { cn } from "@/lib/utils";

export type NavBarLink = {
  kind: "link";
  display: string;
  url: string;
  description?: string;
};

export type NavBarGroup = {
  kind: "group";
  title: string;
  links: NavBarLink[];
};

export type NavBarItem = NavBarLink | NavBarGroup;

export type NavBarProps = {
  header?: NavBarLink;
  logo?: ReactNode;
  links: NavBarItem[];
};

export default function NavBar({ header, logo, links }: NavBarProps) {
  return (
    <div className="mr-8 hidden md:flex">
      {header && (
        <div className="flex space-x-3 items-center">
          <Link href={header.url} className="mr-4 flex items-center space-x-3 lg:mr-6">
            {logo}
            <h1 className="hidden font-bold lg:inline-block">
              <span className="font-normal">cooper / </span>
              {header.display}
            </h1>
          </Link>
        </div>
      )}

      <NavigationMenu>
        <NavigationMenuList>
          {links.map((item) => {
            switch (item.kind) {
              case "group":
                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="text-sm">{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                          {item.links.map((link) => {
                            return (
                              <ListItem title={link.display} key={link.url} href={link.url}>
                                {link.description}
                              </ListItem>
                            );
                          })}
                        </ul>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              case "link":
                return (
                  <NavigationMenuItem key={item.url}>
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.display}</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
            }
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
