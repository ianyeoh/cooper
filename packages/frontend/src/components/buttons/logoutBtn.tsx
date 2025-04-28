"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { tsr } from "@/lib/tsrQuery";

export default function LogoutButton(props: { as: "button" | "dropdownMenuItem"; className?: string }) {
  const router = useRouter();
  const queryClient = tsr.useQueryClient();
  const { mutate, isPending } = tsr.public.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      router.push("/login");
    },
  });

  const { as, ...rest } = props;

  async function handleLogout() {
    mutate({ body: {} });
    queryClient.clear();
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
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} {...rest}>
          {isPending ? <Spinner size="small" /> : "Log out"}
        </DropdownMenuItem>
      );
  }
}
