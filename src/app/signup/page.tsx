"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/components/forms/signupForm";
import AlignChildren from "@/components/alignChildren";
import axios from "@/lib/axios";
import { LoginType, SignupType } from "@/lib/schemas/post/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();

    async function handleSignup({ username, password }: SignupType) {
        try {
            const response = await axios.post("/api/auth/signup", {
                username,
                password,
            } as LoginType);

            if (response.status === 200) {
                toast.success(
                    `User ${username} created successfully. Please log in.`
                );
                router.push("/login");
            } else {
                throw new Error("Failed to create new user.");
            }
        } catch (error) {
            let errMsg;
            if (error instanceof AxiosError) {
                errMsg = error.response?.data.error;
            }

            toast.error(
                `Failed to log in: ${errMsg ?? "Please try again later."}`
            );
        }
    }

    return (
        <div className="h-[100vh] w-[100vw]">
            <AlignChildren alignment="center">
                <Card>
                    <CardHeader>
                        <CardTitle>Sign up</CardTitle>
                        <CardDescription>
                            Enter your username and password to sign up
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignupForm onSubmit={handleSignup} />
                    </CardContent>
                </Card>
            </AlignChildren>
        </div>
    );
}
