"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/forms/loginForm";
import { tsr } from "@/lib/tsrQuery";
import { parseError } from "@cooper/ts-rest/src/utils.ts";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { mutate } = tsr.public.auth.login.useMutation();
  const [redirectToastIds, setRedirectToastIds] = useState<(string | number)[]>([]);

  /* Show toast message indicating reason for redirecting to login page */
  const searchParams = useSearchParams();
  useEffect(() => {
    // Do after 0.5 delay
    setTimeout(() => {
      /* Spawns a new toast that lingers indefinitely */
      function showRedirectReason(reason: string) {
        setRedirectToastIds([
          ...redirectToastIds,
          toast.error(reason, {
            duration: Infinity,
            closeButton: true,
          }),
        ]);
      }

      const redirect = searchParams.get("redirect");

      switch (redirect) {
        case "expiredSession":
          showRedirectReason("Your session expired. Please log in again.");
          break;
      }
    }, 500);
  }, [searchParams, redirectToastIds]);

  function dismissRedirectToasts() {
    for (const id of redirectToastIds) {
      toast.dismiss(id);
    }
    setRedirectToastIds([]);
  }

  async function handleLogin(body: ClientInferRequest<typeof contract.public.auth.login>["body"]) {
    dismissRedirectToasts();

    return new Promise<void>((resolve) => {
      mutate(
        { body },
        {
          onSuccess: async () => {
            router.push("/app");
            resolve();
          },
          onError: async (e) => {
            let errMsg = "Failed to log you in, please try again later.";

            const error = parseError(e);
            if (error.isKnownError) {
              errMsg = `${error.errMsg}`;
            } else {
              console.log(`Unknown error: ${JSON.stringify(e)}`);
            }

            toast.error(errMsg);
            resolve();
          },
        },
      );
    });
  }

  return (
    <div>
      <div className="flex flex-col space-y-2 text-center px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your username and password</p>
      </div>
      <LoginForm onSubmit={handleLogin} />
      <Link href="/signup" className="text-sm text-muted-foreground float-right mt-2" data-cy="signup">
        or <span className="underline">create an account</span>
      </Link>
    </div>
  );
}
