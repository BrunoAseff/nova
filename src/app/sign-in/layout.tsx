"use client";

import { SessionProvider } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <main className="m-0 p-0 font-montserrat">{children}</main>
    </SessionProvider>
  );
}
