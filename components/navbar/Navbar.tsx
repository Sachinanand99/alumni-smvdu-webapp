"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isSuperAdmin = true;

  return (
      <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
        <nav className="flex justify-between items-center">
          <Link href="/" className="">
            <Image src="/logo.png" alt="logo" width={48} height={48} />
          </Link>
          <div className="flex items-center justify-end gap-5 text-black">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                      href="/"
                      className={`${navigationMenuTriggerStyle()} ${
                          pathname === "/" ? "active-link" : ""
                      }`}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <>
                  {isSuperAdmin ? (
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                            <ListItem
                                title="View Events"
                                href="/events"
                                className={`${
                                    pathname === "/events" ? "active-link" : ""
                                }`}
                            >
                              View Latest Events.
                            </ListItem>
                            <ListItem
                                title="Create Events"
                                href="/events/create"
                                className={`${
                                    pathname === "/events/create" ? "active-link" : ""
                                }`}
                            >
                              Create new events.
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                  ) : (
                      <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/events"
                            className={`${navigationMenuTriggerStyle()} ${
                                pathname === "/events" ? "active-link" : ""
                            }`}
                        >
                          Events
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                  )}
                </>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Alumni Directory</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                      <ListItem
                          title="List View"
                          href="/alumni/list-alumni"
                          className={`${
                              pathname === "/alumni/list-alumni" ? "active-link" : ""
                          }`}
                      >
                        Discover our vibrant alumni network.
                      </ListItem>
                      <ListItem
                          title="Map View"
                          href="/alumni/map-alumni"
                          className={`${
                              pathname === "/alumni/map-alumni" ? "active-link" : ""
                          }`}
                      >
                        Get insights into alumni of SMVDU all around the globe.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                        <ListItem
                            title="Alumni Information"
                            href="/alumni/alumni-info"
                            className={`${
                                pathname === "/alumni/alumni-info"
                                    ? "active-link"
                                    : ""
                            }`}
                        >
                          Update the alumni information to us.
                        </ListItem>
                        <ListItem
                            title="Campus Visit"
                            href="/alumni/visit-campus"
                            className={`${
                                pathname === "/alumni/visit-campus"
                                    ? "active-link"
                                    : ""
                            }`}
                        >
                          Visiting the campus for mentorship.
                        </ListItem>
                        <ListItem title="Contact Us" href="/#contact">
                          Contact Us for queries.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </>

                {session && (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                            <ListItem
                                title="Change your Email ID"
                                href="/profile/profile-setup"
                            >
                              Register your personal profile.
                            </ListItem>
                            <li>
                              <button
                                  onClick={() => {
                                    signOut();
                                  }}
                                  className="block w-3/4 text-left py-2 px-4 border border-red-500 rounded-md text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                              >
                                Logout
                              </button>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </>
                )}

                {!session && (
                    <NavigationMenuItem>
                      <NavigationMenuLink
                          href="/auth/login"
                          className={`${navigationMenuTriggerStyle()} ${
                              pathname === "/auth/login" ? "active-link" : ""
                          }`}
                      >
                        Login
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      </header>
  );
};

export default Navbar;

const ListItem = React.forwardRef(
    ({ className, title, children, ...props }, ref) => {
      return (
          <li>
            <NavigationMenuLink asChild>
              <a
                  ref={ref}
                  className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      className
                  )}
                  {...props}
              >
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              </a>
            </NavigationMenuLink>
          </li>
      );
    }
);
ListItem.displayName = "ListItem";
