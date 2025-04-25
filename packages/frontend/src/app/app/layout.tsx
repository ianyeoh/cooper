import { PropsWithChildren } from "react";
import { Metadata } from "next";
import Header from "@/components/navbars/header";

export const metadata: Metadata = {
  title: "cooper",
  description: "Home resource management system",
};

export default async function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 border-b flex items-stretch">
        <div className="grow flex justify-center py-6 md:py-0">
          <div className="container flex max-w-screen-2xl items-start break-words">{children}</div>
        </div>
      </main>
      <footer>
        <div className="flex justify-center py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Ian Yeoh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
