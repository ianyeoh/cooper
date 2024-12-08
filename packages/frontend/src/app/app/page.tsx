import AccountDropdown from "@/components/accountDropdown";
import ThemeBtn from "@/components/theming/themeBtn";

export default function AppDirectory() {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background">
            <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <nav className="flex items-center gap-2">
                            <ThemeBtn variant="ghost" />
                            <AccountDropdown />
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1 border-b">
                <div className="grid gap-3">
                    hello worldd
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
