import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider";
import "./globals.css";
import { TSRClientProvider } from "@/components/tsrClientProvider";

export const metadata: Metadata = {
    title: "budgeting - Custom expense tracking solution",
    description: "Custom expense tracking solution",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TSRClientProvider>
                        {children}
                        <Toaster />
                    </TSRClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
