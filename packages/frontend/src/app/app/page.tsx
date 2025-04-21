import { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeBtn from "@/components/theming/themeBtn";
import AccountDropdown from "@/components/accountDropdown";
import { SquareTerminal, Wallet /* , Warehouse */ } from "lucide-react";
import Link from "next/link";

type App = {
  name: string;
  description: string;
  icon: ReactNode;
  url: string;
};

type AppList = App[];

function AppCard({ app }: { app: App }) {
  return (
    <Card key={app.name} className="transition ease-in-out hover:shadow-foreground/30 w-full sm:w-[270px] grow">
      <Link href={app.url}>
        <CardHeader>
          <div className="flex gap-5">
            <div className="flex flex-col gap-3">
              <CardTitle>
                <span className="font-normal">cooper /</span>
                {" " + app.name}
              </CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </div>
            {app.icon}
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}

export default function AppDirectory() {
  const iconSize = 45;
  const apps: AppList = [
    {
      name: "budgeting",
      description: "An all-in-one solution to budgeting finances and tracking expenses.",
      icon: <Wallet width={iconSize} height={iconSize} />,
      url: "/app/budgeting",
    },
    // {
    //   name: "inventory",
    //   description: "Manage and track household items and their locations easily.",
    //   icon: <Warehouse width={iconSize} height={iconSize} />,
    //   url: "/app/inventory/dashboard",
    // },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl gap-3 items-center">
          <SquareTerminal strokeWidth={1.3} width={28} />
          <span className="font-normal">
            cooper /<span className="font-semibold"> apps</span>
          </span>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <nav className="flex items-center gap-2">
              <ThemeBtn variant="ghost" />
              <AccountDropdown />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 border-b py-5 px-10 w-screen">
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-y-6 gap-x-4 max-w-screen-2xl px-10">
            {apps.map((app, index) => {
              return <AppCard key={index} app={app} />;
            })}

            {/* Adding phantom cards to the end to ensure last row matches rest of flexbox */}
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
            <div className="grow invisible w-full sm:w-[270px]"></div>
          </div>
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
