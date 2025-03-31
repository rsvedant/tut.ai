import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import {
    Navbar as HeroUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import NextLink from "next/link";
import { memo, useCallback, useState } from "react";

import {
    DiscordIcon,
    GithubIcon,
    Logo,
    SearchIcon,
    TwitterIcon,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { LoginHandler } from "@/components/ui/login";
import { siteConfig } from "@/config/site";

// Memoized search input component to prevent unnecessary re-renders
const SearchInput = memo(() => (
    <Input
        aria-label="Search"
        classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
        }}
        endContent={
            <Kbd className="hidden lg:inline-block" keys={["command"]}>
                K
            </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
    />
));

SearchInput.displayName = "SearchInput";

// Memoized social links component to prevent unnecessary re-renders
const SocialLinks = memo(() => (
    <>
        <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
        </Link>
        <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
        </Link>
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
    </>
));

SocialLinks.displayName = "SocialLinks";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handle menu toggle with useCallback to prevent unnecessary re-renders
    const handleMenuToggle = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    return (
        <HeroUINavbar
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            position="sticky"
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                        className="flex justify-start items-center gap-1"
                        href="/"
                    >
                        <Logo />
                        <p className="font-bold text-inherit">
                            tut<span className="text-primary">.ai</span>
                        </p>
                    </NextLink>
                </NavbarBrand>
                <ul className="hidden lg:flex gap-4 justify-start ml-2">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <NextLink
                                className={clsx(
                                    linkStyles({ color: "foreground" }),
                                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                                )}
                                color="foreground"
                                href={item.href}
                            >
                                {item.label}
                            </NextLink>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <SocialLinks />
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    <SearchInput />
                </NavbarItem>
                <NavbarItem className="hidden md:flex">
                    <LoginHandler />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <Link
                    isExternal
                    aria-label="Github"
                    href={siteConfig.links.github}
                >
                    <GithubIcon className="text-default-500" />
                </Link>
                <ThemeSwitch />
                <NavbarMenuToggle onClick={handleMenuToggle} />
            </NavbarContent>
            <NavbarMenu>
                <SearchInput />
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.label}-${index}`}>
                            <Link
                                color={
                                    index === 2
                                        ? "primary"
                                        : index ===
                                            siteConfig.navMenuItems.length - 1
                                            ? "danger"
                                            : "foreground"
                                }
                                href={item.href}
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </HeroUINavbar>
    );
};
