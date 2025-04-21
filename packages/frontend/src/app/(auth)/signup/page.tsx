"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/forms/signupForm";
import { toast } from "sonner";
import { ClientInferRequest } from "@ts-rest/core";
import { contract } from "@cooper/ts-rest/src/contract";
import { tsr } from "@/lib/tsr-query";
import { parseError } from "@cooper/ts-rest/src/utils";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { mutate } = tsr.public.auth.signup.useMutation();

  async function handleSignup(body: ClientInferRequest<typeof contract.public.auth.signup>["body"]) {
    return new Promise<void>((resolve, reject) => {
      mutate(
        { body },
        {
          onSuccess: async () => {
            toast.success("You were signed up successfully. Please log in.");
            router.push("/login");
            resolve();
          },
          onError: async (e) => {
            let errMsg = "Failed to create new user, please try again later.";

            const error = parseError(e);
            if (error.isKnownError) {
              errMsg = error.errMsg;
            } else {
              console.log(`Unknown error: ${JSON.stringify(e)}`);
            }

            toast.error(errMsg);
            reject(error);
          },
        },
      );
    });
  }

  return (
    <div>
      <div className="flex flex-col space-y-2 text-center px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
        <p className="text-sm text-muted-foreground">Enter your details below</p>
      </div>
      <SignupForm onSubmit={handleSignup} />
      <Link href="/login" className="text-sm text-muted-foreground float-right mt-2">
        or <span className="underline">log in</span>
      </Link>
    </div>
  );
}
