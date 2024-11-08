"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsr } from "@/lib/tsr";
import { ReactNode } from "react";

export function TSRClientProvider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
        </QueryClientProvider>
    );
}
