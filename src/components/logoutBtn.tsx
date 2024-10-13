"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdownMenu";

export default function LogoutButton(props: {
    as: "button" | "dropdownMenuItem";
    className?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { as, ...rest } = props;

    async function handleLogout() {
        try {
            setLoading(true);
            await axios.get("/api/auth/logout");
            router.push("/login");
        } catch {
            toast.error("Failed to log you out. Please try again later.");
            setLoading(false);
        }
    }

    switch (as) {
        case "button":
            return (
                <Button onClick={handleLogout} disabled={loading} {...rest}>
                    {loading ? <Spinner size="small" /> : "Log out"}
                </Button>
            );
        case "dropdownMenuItem":
            return (
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loading}
                    {...rest}
                >
                    {loading ? <Spinner size="small" /> : "Log out"}
                </DropdownMenuItem>
            );
    }
}
