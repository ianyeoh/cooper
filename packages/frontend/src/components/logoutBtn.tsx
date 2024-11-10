"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { tsr } from "@/lib/ts-rest-client";

export default function LogoutButton(props: {
    as: "button" | "dropdownMenuItem";
    className?: string;
}) {
    const router = useRouter();
    const { mutate, isPending } = tsr.auth.logout.useMutation({
        onSuccess: () => {
            router.push("/login");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to log you out. Please try again later.");
        },
    });

    const { as, ...rest } = props;

    async function handleLogout() {
        mutate({ body: null });
    }

    switch (as) {
        case "button":
            return (
                <Button onClick={handleLogout} disabled={isPending} {...rest}>
                    {isPending ? <Spinner size="small" /> : "Log out"}
                </Button>
            );
        case "dropdownMenuItem":
            return (
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    {...rest}
                >
                    {isPending ? <Spinner size="small" /> : "Log out"}
                </DropdownMenuItem>
            );
    }
}
