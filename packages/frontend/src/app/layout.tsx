import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsr } from "@/lib/tsr";
import "./globals.css";

export const metadata: Metadata = {
    title: "budgeting - Custom expense tracking solution",
    description: "Custom expense tracking solution",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = new QueryClient();

    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <QueryClientProvider client={queryClient}>
                    <tsr.ReactQueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </tsr.ReactQueryProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
