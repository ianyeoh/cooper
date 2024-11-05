import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import "./globals.css";
import { useState } from "react";

export const metadata: Metadata = {
    title: "budgeting - Custom expense tracking solution",
    description: "Custom expense tracking solution",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000/trpc",
                    // You can pass any HTTP headers you wish here
                    // async headers() {
                    //     return {
                    //         authorization: getAuthCookie(),
                    //     };
                    // },
                }),
            ],
        })
    );

    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <trpc.Provider
                        client={trpcClient}
                        queryClient={queryClient}
                    >
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </trpc.Provider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
