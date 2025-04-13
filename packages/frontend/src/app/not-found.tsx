import Header from "@/components/navbars/header";
import { NavBarItem } from "@/components/navbars/navBar";
import NotFoundRender from "@/components/notFound/notFoundAnimation";
import { SquareTerminal } from "lucide-react";

export default function NotFound() {
  const header = {
    kind: "link",
    display: "not-found",
    url: "/app",
  };
  const logo = <SquareTerminal strokeWidth={1.3} width={28} />;
  const links: NavBarItem[] = [];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <Header header={header} logo={logo} links={links} />
      <main className="flex-1">
        <div className="absolute top-0 left-0 h-full w-full">
          <NotFoundRender />
        </div>
      </main>
    </div>
  );
}
