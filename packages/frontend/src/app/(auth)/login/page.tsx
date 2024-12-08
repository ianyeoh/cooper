"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/forms/loginForm";
import { tsr } from "@/lib/ts-rest-client";
import { parseError } from "@cooper/ts-rest/src/utils.ts";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const { mutate } = tsr.auth.login.useMutation();
    const [redirectToastIds, setRedirectToastIds] = useState<
        (string | number)[]
    >([]);

    /* Show toast message indicating reason for redirecting to login page */
    const searchParams = useSearchParams();
    useEffect(() => {
        // Do after 0.5 delay
        setTimeout(() => {
            const redirect = searchParams.get("redirect");

            switch (redirect) {
                case "expiredSession":
                    showRedirectReason(
                        "Your session expired. Please log in again."
                    );
                    break;
            }
        }, 500);
    }, [searchParams]);

    // Spawns a new toast that lingers indefinitely
    function showRedirectReason(reason: string) {
        setRedirectToastIds([
            ...redirectToastIds,
            toast.error(reason, {
                duration: Infinity,
                closeButton: true,
            }),
        ]);
    }

    function dismissRedirectToasts() {
        for (const id of redirectToastIds) {
            toast.dismiss(id);
        }

        setRedirectToastIds([]);
    }

    async function handleLogin(
        body: ClientInferRequest<typeof contract.auth.login>["body"]
    ) {
        dismissRedirectToasts();

        return new Promise<void>((resolve, reject) => {
            mutate(
                { body },
                {
                    onSuccess: async () => {
                        router.push("/app");
                        resolve();
                    },
                    onError: async (e) => {
                        let errMsg =
                            "Failed to log you in, please try again later.";

                        const error = parseError(e);
                        if (error.isKnownError) {
                            errMsg = `Failed to log you in: ${error.errMsg}`;
                        } else {
                            console.log(`Unknown error: ${JSON.stringify(e)}`);
                        }

                        toast.error(errMsg);
                        reject(error);
                    },
                }
            );
        });
    }

    return <LoginForm onSubmit={handleLogin} />;
}
