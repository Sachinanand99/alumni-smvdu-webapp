"use client";

import React, { useState } from "react";
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

const Navbar = ({ isSuperAdmin }: { isSuperAdmin: boolean }) => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm font-work-sans sticky top-0 z-50 w-full">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="/" className="flex-shrink-0">
                        <Image src="/logo.png" alt="logo" width={48} height={48} priority />
                    </Link>
                    <button
                        className="md:hidden text-lg font-semibold border px-3 py-1 rounded-md"
                        onClick={() => setMobileOpen(prev => !prev)}
                    >
                        ☰
                    </button>
                </div>

                {/* Navigation */}
                <nav
                    className={cn(
                        "w-full md:w-auto md:flex md:items-center md:gap-6 transition-all duration-300 ease-in-out",
                        mobileOpen ? "block mt-4 md:mt-0" : "hidden md:block"
                    )}
                >
                    <NavigationMenu>
                        <NavigationMenuList className="flex flex-col gap-3 md:flex-row md:items-center">
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
                                    <NavigationMenuContent >
                                        <ul className="grid gap-3 w-full sm:grid-cols-1 md:grid-cols-2 p-3">
                                            <ListItem title="View Events" href="/events" className={pathname === "/events" && "active-link"}>
                                                View Latest Events.
                                            </ListItem>
                                            <ListItem title="Create Events" href="/events/create" className={pathname === "/events/create" && "active-link"}>
                                                Create new events.
                                            </ListItem>
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
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 w-full sm:grid-cols-1 md:grid-cols-2 p-3">
                                        <ListItem title="List View" href="/alumni/list-alumni" className={pathname === "/alumni/list-alumni" && "active-link"}>
                                            Discover our vibrant alumni network.
                                        </ListItem>
                                        <ListItem title="Map View" href="/alumni/map-alumni" className={pathname === "/alumni/map-alumni" && "active-link"}>
                                            Explore global alumni.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                                <NavigationMenuContent >
                                    <ul className="grid gap-3 w-full sm:grid-cols-1 md:grid-cols-2 p-3">
                                        <ListItem title="Alumni Info" href="/alumni/alumni-info" className={pathname === "/alumni/alumni-info" && "active-link"}>
                                            Update your alumni profile.
                                        </ListItem>
                                        <ListItem title="Campus Visit" href="/alumni/visit-campus" className={pathname === "/alumni/visit-campus" && "active-link"}>
                                            Schedule a campus visit.
                                        </ListItem>
                                        <ListItem title="Contact Us" href="/#contact">
                                            Get in touch.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {session ? (
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 w-full sm:grid-cols-1 md:grid-cols-2 p-3">
                                            <ListItem title="Update Email" href="/profile/profile-setup">
                                                Personal profile registration.
                                            </ListItem>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        toast("👋 Logged out successfully");
                                                        setTimeout(() => signOut({}), 500);
                                                    }}
                                                    className="w-full px-3 py-2 text-left border border-red-500 rounded-md text-red-600 hover:bg-red-500 hover:text-white transition"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ) : (
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/auth/login"
                                        className={cn(navigationMenuTriggerStyle(), pathname === "/auth/login" && "active-link")}
                                    >
                                        Login
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

// ListItem component
const ListItem = React.forwardRef(
    (
        { className, title, children, href, ...props }: {
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
                            <p className="text-sm text-muted-foreground line-clamp-2">{children}</p>
                        )}
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";
