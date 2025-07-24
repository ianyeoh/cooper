"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsr } from "@/lib/tsrQuery";
import { ThemeProvider } from "@/components/theming/themeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
}
