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
import { contract } from "@cooper/ts-rest/src/contract";
import { z } from "zod";

const transactionSchema = contract.transactions.newTransaction.body;
type TransactionType = z.infer<typeof transactionSchema>;

export default function TransactionForm({
    onSubmit,
}: {
    onSubmit: (values: TransactionType) => void;
}) {
    const form = useForm<TransactionType>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: "",
            date: new Date(),
            amount: 0,
            accountId: "",
            categoryId: "",
            comments: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[100%]">
                <div className="space-y-3 w-[100%]">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="comments"
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
    );
}
