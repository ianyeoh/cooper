"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
    transactionsSchema,
    TransactionsType,
} from "@/lib/schemas/post/transactions";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { accountListSchema, AccountListType } from "@/lib/schemas/get/account";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function NewTransactionForm({
    onSubmit,
}: {
    onSubmit: (values: TransactionsType) => void;
}) {
    const form = useForm<TransactionsType>({
        resolver: zodResolver(transactionsSchema),
        defaultValues: {
            account: "",
            date: undefined,
            description: "",
            category: "",
            amount: 0,
            comments: "",
        },
    });

    const [accountsList, setAccountsList] = useState<
        AccountListType | undefined
    >();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function getAccountsList() {
        setIsLoading(true);

        axios
            .get("/api/accounts")
            .then((response) => {
                const parseResult = accountListSchema.safeParse(response.data);
                if (!parseResult.success) {
                    throw new Error("Bad response from server");
                }

                setAccountsList(parseResult.data);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Failed to fetch accounts list.", {
                    duration: Infinity,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            getAccountsList();
                        },
                    },
                });
                setIsLoading(false);
            });
    }

    useEffect(getAccountsList, []);

    if (isLoading) {
        return (
            <div className="p-5 flex justify-center items-center gap-3">
                Loading
                <Spinner size="small" className="text-foreground" />
            </div>
        );
    } else {
        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-[100%]"
                >
                    <div className="space-y-3 w-[100%]">
                        <FormField
                            control={form.control}
                            name="account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accountsList?.map((account) => (
                                                <SelectItem
                                                    key={account.name}
                                                    value={account.name}
                                                >
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        You can manage your accounts from the{" "}
                                        <Link
                                            href="/dashboard/accounts"
                                            className="underline"
                                        >
                                            accounts page
                                        </Link>
                                        .
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Select date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() ||
                                                    date <
                                                        new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Your date of birth is used to calculate
                                        your age.
                                    </FormDescription>
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
                                "Create"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        );
    }
}
