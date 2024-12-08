import MobileNavBar from "@/components/navbars/mobileNavBar";
import NavBar, { NavBarProps } from "@/components/navbars/navBar";
import AccountDropdown from "@/components/accountDropdown";
import ThemeBtn from "@/components/theming/themeBtn";
import SearchBar from "@/components/searchBar";

export default function Header({ header, logo, links }: NavBarProps) {
    return (
        <header className="sticky flex justify-center top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                {/* Shows only on wide screens (desktop) */}
                <NavBar header={header} links={links} logo={logo} />

                {/* Shows only on smaller screens (mobile) */}
                <MobileNavBar header={header} links={links} logo={logo} />

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <SearchBar />
                    <nav className="flex items-center gap-2">
                        <ThemeBtn variant="ghost" />
                        <AccountDropdown />
                    </nav>
                </div>
            </div>
        </header>
    );
}
