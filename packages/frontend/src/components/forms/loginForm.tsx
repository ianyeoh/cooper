"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { contract } from "@cooper/ts-rest/src/contract";

const loginSchema = contract.public.auth.login.body;
type LoginType = z.infer<typeof loginSchema>;

export function LoginForm({
    onSubmit,
}: {
    onSubmit: (values: LoginType) => void;
}) {
    const form = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    return (
        <>
            <div className="flex flex-col space-y-2 text-center px-8">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your username and password
                </p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-[100%]"
                >
                    <div className="space-y-3 w-[100%]">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <Spinner size="small" />
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
