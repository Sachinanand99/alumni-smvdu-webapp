import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import {cn} from "@/lib/utils";

const alumniDirectoryComponents: { title: string; href: string; description: string }[] = [
  {
    title: "List View",
    href: "/list-alumni",
    description: "Discover our vibrant alumni network",
  },
  {
    title: "Map View",
    href: "/map-alumni",
    description: "Get insights of alumni of SMVDU all around the globe",
  },
];
const servicesComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Alumni Information",
    href: "/alumni-info",
    description: "Update the alumni information to us.",
  },
  {
    title: "Campus Visit",
    href: "/visit-campus",
    description: "Visiting the campus for mentorship",
  },
  {
    title: "Contact Us",
    href: "/#contact",
    description: "Contact Us for queries",
  },
];

const Navbar = () => {
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
                   className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                   href="/events"
                   className={navigationMenuTriggerStyle()}
                >
                  Events
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Alumni Directory</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                    {alumniDirectoryComponents.map((component) => (
                       <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                       >
                         {component.description}
                       </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[450px] ">
                    {servicesComponents.map((component) => (
                       <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                       >
                         {component.description}
                       </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                   href="/login"
                   className={navigationMenuTriggerStyle()}
                >
                  Login
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </header>
  );
}


export default Navbar

const ListItem = React.forwardRef<
   React.ElementRef<"a">,
   React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
           <div className="text-sm font-medium leading-none ">{title}</div>
           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
             {children}
           </p>
         </a>
       </NavigationMenuLink>
     </li>
  )
})
ListItem.displayName = "ListItem"
