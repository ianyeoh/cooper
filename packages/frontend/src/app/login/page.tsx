"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/forms/loginForm";
import { WalletMinimal } from "lucide-react";
import ThemeBtn from "@/components/themeBtn";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils.ts";
import { tsr } from "@/lib/tsr.ts";

export default function LoginPage() {
    const router = useRouter();
    const { mutate } = tsr.auth.login.useMutation();

    async function handleLogin(body: { username: string; password: string }) {
        return new Promise<void>((resolve, reject) => {
            mutate(
                { body },
                {
                    onSuccess: async () => {
                        router.push("/dashboard");
                        resolve();
                    },
                    onError: async (error) => {
                        toast.error(`Failed to log you in: ${error}`);
                        reject(error);
                    },
                }
            );
        });
    }

    return (
        <div className={cn("flex h-[100vh] w-[100vw]", GeistSans.className)}>
            <div className="bg-zinc-900 h-[100%] w-[50%] flex-col p-8 text-white dark:border-r space-y-2 hidden sm:flex">
                <div className="flex space-x-3 items-center">
                    <WalletMinimal />
                    <h1 className="text-lg font-medium">Budgeting</h1>
                </div>
                <div className="flex-grow"></div>
                <p className="text-lg">
                    An all-in-one expense tracking and budgeting application
                </p>
                <p className="text-sm">by Ian Yeoh</p>
            </div>
            <div className="relative bg-background h-[100%] sm:w-[50%] w-full flex flex-col items-center justify-center p-8">
                <div className="absolute flex sm:hidden top-7 justify-center px-9 w-screen">
                    <div className="flex space-x-3 items-center">
                        <WalletMinimal />
                        <h1 className="text-lg font-medium">Budgeting</h1>
                    </div>
                    <ThemeBtn className="ml-auto" />
                </div>

                <div className="max-w-[400px] space-y-6 mx-6">
                    <ThemeBtn className="absolute top-7 right-9 hidden sm:flex" />

                    <div className="flex flex-col space-y-2 text-center px-8">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign in
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your username and password
                        </p>
                    </div>
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
}
