"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsr } from "@/lib/tsr-query";
import { ThemeProvider } from "@/components/theming/themeProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
}
