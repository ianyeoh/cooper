import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet /* , Warehouse */ } from "lucide-react";

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

export default async function AppDirectory() {
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
    <div className="flex flex-wrap gap-y-6 gap-x-4 max-w-screen-2xl py-5">
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
  );
}
