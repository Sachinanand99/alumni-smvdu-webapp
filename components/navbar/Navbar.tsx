"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const Navbar = ({ isSuperAdmin }: { isSuperAdmin: boolean }) => {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleLogout = () => {
        toast("👋 Logged out successfully");
        setTimeout(() => signOut({}), 500);
    };

    const isLoggedIn = status === "authenticated";

    return (
        <header className="bg-white shadow-sm font-work-sans sticky top-0 z-50 w-full">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex-shrink-0">
                    <Image src="/logo.png" alt="logo" width={48} height={48} priority />
                </Link>

                {/* Mobile Nav Trigger */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger className="text-lg font-semibold border px-3 py-1 rounded-md">
                            ☰
                        </SheetTrigger>
                        <SheetContent side="left" className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-6">
                                <LinkItem href="/" label="Home" active={pathname === "/"} />

                                {isSuperAdmin ? (
                                    <Dropdown label="Events">
                                        <LinkItem href="/events" label="View Events" active={pathname === "/events"} />
                                        <LinkItem href="/events/create" label="Create Events" active={pathname === "/events/create"} />
                                    </Dropdown>
                                ) : (
                                    <LinkItem href="/events" label="Events" active={pathname === "/events"} />
                                )}

                                <Dropdown label="Alumni Directory">
                                    <LinkItem href="/alumni/list-alumni" label="List View" active={pathname === "/alumni/list-alumni"} />
                                    <LinkItem href="/alumni/map-alumni" label="Map View" active={pathname === "/alumni/map-alumni"} />
                                </Dropdown>

                                <Dropdown label="Services">
                                    <LinkItem href="/alumni/alumni-info" label="Alumni Info" active={pathname === "/alumni/alumni-info"} />
                                    <LinkItem href="/alumni/visit-campus" label="Campus Visit" active={pathname === "/alumni/visit-campus"} />
                                    <LinkItem href="/#contact" label="Contact Us" active={pathname === "/#contact"} />
                                </Dropdown>

                                {!hydrated || status === "loading" ? (
                                    <div className="animate-pulse px-3 py-2 rounded-md bg-muted w-24 h-6" />
                                ) : isLoggedIn ? (
                                    <Dropdown label="Profile">
                                        <LinkItem href="/profile/profile-setup" label="Update Email" />
                                        <button onClick={handleLogout} className="text-left px-3 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition">
                                            Logout
                                        </button>
                                    </Dropdown>
                                ) : (
                                    <LinkItem href="/auth/login" label="Login" active={pathname === "/auth/login"} />
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-0">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/"
                                    className={cn(navigationMenuTriggerStyle(), pathname === "/" && "active-link")}
                                >
                                    Home
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {isSuperAdmin ? (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px]">
                                            <ListItem href="/events" title="View Events" className={pathname === "/events" && "active-link"}>View Latest Events.</ListItem>
                                            <ListItem href="/events/create" title="Create Events" className={pathname === "/events/create" && "active-link"}>Create new events.</ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ) : (
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/events"
                                        className={cn(navigationMenuTriggerStyle(), pathname === "/events" && "active-link")}
                                    >
                                        Events
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )}

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Alumni Directory</NavigationMenuTrigger>
                                <NavigationMenuContent >
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px]">
                                        <ListItem href="/alumni/list-alumni" title="List View" className={pathname === "/alumni/list-alumni" && "active-link"}>Discover our vibrant alumni network.</ListItem>
                                        <ListItem href="/alumni/map-alumni" title="Map View" className={pathname === "/alumni/map-alumni" && "active-link"}>Explore global alumni.</ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px]">
                                        <ListItem href="/alumni/alumni-info" title="Alumni Info" className={pathname === "/alumni/alumni-info" && "active-link"}>Update your alumni profile.</ListItem>
                                        <ListItem href="/alumni/visit-campus" title="Campus Visit" className={pathname === "/alumni/visit-campus" && "active-link"}>Schedule a campus visit.</ListItem>
                                        <ListItem href="/#contact" title="Contact Us">Get in touch.</ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                {!hydrated || status === "loading" ? (
                                    <div className="animate-pulse w-20 h-8 bg-muted rounded-md" />
                                ) : isLoggedIn ? (
                                    <>
                                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                                        <NavigationMenuContent className={"absolute left-0 origin-top-right"}>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px]">
                                                <ListItem href="/profile/profile-setup" title="Update Email" className={pathname === "/profile/profile-setup" && "active-link"}>Personal profile registration.</ListItem>
                                                <li>
                                                    <button onClick={handleLogout} className="w-full px-3 py-2 text-left border border-red-500 rounded-md text-red-600 hover:bg-red-500 hover:text-white transition">
                                                        Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                ) : (
                                    <NavigationMenuLink
                                        href="/auth/login"
                                        className={cn(navigationMenuTriggerStyle(), pathname === "/auth/login" && "active-link")}
                                    >
                                        Login
                                    </NavigationMenuLink>
                                )}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

const LinkItem = ({ href, label, active }: { href: string; label: string; active?: boolean }) => (
    <Link
        href={href}
        className={cn(
            "px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition",
            active && "active-link"
        )}
    >
        {label}
    </Link>
);

const Dropdown = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <div className="font-semibold">{label}</div>
        <div className="ml-3 flex flex-col gap-1">{children}</div>
    </div>
);

const ListItem = React.forwardRef(
    (
        {
            className,
            title,
            children,
            href,
            ...props
        }: {
            className?: string;
            title: string;
            children?: React.ReactNode;
            href: string;
        },
        ref: React.Ref<HTMLAnchorElement>
    ) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        href={href}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition hover:bg-accent hover:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-semibold">{title}</div>
                        {children && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {children}
                            </p>
                        )}
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";