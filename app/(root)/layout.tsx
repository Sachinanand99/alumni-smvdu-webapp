import React from "react";

export default async function RootLayout({ children,}: Readonly<{ children: React.ReactNode;
}>){

  return (
     <main className="font-work-sans scroll-smooth">
       {children}
     </main>
  )
}