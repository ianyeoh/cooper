"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/forms/loginForm";
import { tsr } from "@/lib/ts-rest-client";
import { parseError } from "@cooper/ts-rest/src/utils.ts";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";

export default function LoginPage() {
    const router = useRouter();
    const { mutate } = tsr.auth.login.useMutation();

    async function handleLogin(
        body: ClientInferRequest<typeof contract.auth.login>["body"]
    ) {
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
