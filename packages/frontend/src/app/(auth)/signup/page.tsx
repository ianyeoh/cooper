"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/forms/signupForm";
import { toast } from "sonner";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";
import { tsr } from "@/lib/ts-rest-client";
import { parseError } from "@cooper/ts-rest/src/utils";

export default function SignupPage() {
    const router = useRouter();
    const { mutate } = tsr.public.auth.signup.useMutation();

    async function handleSignup(
        body: ClientInferRequest<typeof contract.public.auth.signup>["body"]
    ) {
        return new Promise<void>((resolve, reject) => {
            mutate(
                { body },
                {
                    onSuccess: async () => {
                        toast.success(
                            "You were signed up successfully. Please log in."
                        );
                        router.push("/login");
                        resolve();
                    },
                    onError: async (e) => {
                        let errMsg =
                            "Failed to create new user, please try again later.";

                        const error = parseError(e);
                        if (error.isKnownError) {
                            errMsg = error.errMsg;
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

    return <SignupForm onSubmit={handleSignup} />;
}
