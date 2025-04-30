"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { contract } from "@cooper/ts-rest/src/contract";
import { z } from "zod";
import { cn } from "@/lib/utils";

const transactionSchema = contract.protected.budgeting.workspaces.byId.transactions.newTransaction.body;
type TransactionType = z.infer<typeof transactionSchema>;

export default function TransactionForm({
  onSubmit,
  buttonText,
  buttonAlign = "end",
  initialValues,
}: {
  onSubmit: (values: TransactionType) => void;
  buttonText?: string;
  buttonAlign?: "start" | "end" | "full";
  initialValues?: TransactionType;
}) {
  const form = useForm<TransactionType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialValues ?? {
      description: "",
      date: new Date(),
      amount: 0,
      accountId: "",
      categoryId: "",
      comments: "",
    },
  });

  const submitButtonText = buttonText ?? "Create";
  let submitButtonAlignment;
  switch (buttonAlign) {
    case "start":
      submitButtonAlignment = "justify-start";
      break;
    case "end":
      submitButtonAlignment = "justify-end";
      break;
  }

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
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={cn("w-full flex", submitButtonAlignment)}>
            <Button
              type="submit"
              className={cn(buttonAlign === "full" ? "grow" : "")}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner size="small" /> : submitButtonText}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
