import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/utils/Header";

export const metadata: Metadata = {
  title: "SMVDU Alumni Network",
  description: "Website for SMVDU Alumni Network",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
     <html lang="en">
     <body
        className={"bg-amber-50"} suppressHydrationWarning={true}
     >
     <SessionProvider>
     <Header/>

     {children}
     <Toaster />
     </SessionProvider>
     </body>
     </html>
  );
}
