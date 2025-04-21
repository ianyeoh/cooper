"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { contract } from "@cooper/ts-rest/src/contract";

const workspaceSchema = contract.protected.budgeting.workspaces.newWorkspace.body;
type WorkspaceType = z.infer<typeof workspaceSchema>;

export function WorkspaceForm({ onSubmit }: { onSubmit: (values: WorkspaceType) => void }) {
  const form = useForm<WorkspaceType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

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

          <div className="w-full flex justify-end">
            <Button type="submit" className="" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner size="small" /> : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
