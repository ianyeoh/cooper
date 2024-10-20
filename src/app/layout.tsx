import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "budgeting - Custom expense tracking solution",
    description: "Custom expense tracking solution",
};

export default async function RootLayout({
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
                    {children}
                    <Toaster
                        closeButton
                        toastOptions={{
                            classNames: {
                                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto",
                                closeButton: "bg-inherit",
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
