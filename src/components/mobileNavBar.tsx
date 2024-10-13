"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scrollArea";
import { ChartColumn, Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileNavBar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Drawer direction="left" open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setOpen(true);
                        }}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                    >
                        <Menu strokeWidth={1.5} />
                    </Button>
                </DrawerTrigger>
                <DrawerContent
                    className="sm:max-w-sm mr-[200px] rounded-none min-w-[200px]"
                    showBar={false}
                >
                    <Button
                        variant="ghost"
                        className="absolute top-5 right-5 p-0 h-fit hover:bg-background"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <X strokeWidth={1.5} size={17} />
                    </Button>
                    <div className="flex flex-col space-y-5 h-screen p-7">
                        <div className="flex h-15 space-x-3 items-center">
                            <Link
                                href="/dashboard"
                                className="mr-4 flex items-center space-x-2 lg:mr-6"
                            >
                                <ChartColumn strokeWidth={1.5} size={19} />
                                <h1 className="font-bold">budgeting</h1>
                            </Link>
                        </div>
                        <ScrollArea className="flex-1 ml-7">
                            <div className="flex flex-col space-y-3">
                                <Link href="/dashboard/transactions">
                                    Transactions
                                </Link>
                            </div>
                        </ScrollArea>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
