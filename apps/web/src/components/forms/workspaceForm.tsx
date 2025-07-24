"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { contract } from "@cooper/ts-rest/src/contract";
import { cn } from "@/lib/utils";

const workspaceSchema = contract.protected.budgeting.workspaces.newWorkspace.body;
type WorkspaceType = z.infer<typeof workspaceSchema>;

export function WorkspaceForm({
  onSubmit,
  buttonText,
  buttonAlign = "end",
  initialValues,
}: {
  onSubmit: (values: WorkspaceType) => void;
  buttonText?: string;
  buttonAlign?: "start" | "end" | "full";
  initialValues?: WorkspaceType;
}) {
  const form = useForm<WorkspaceType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: initialValues ?? {
      name: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter workspace name" {...field} />
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
