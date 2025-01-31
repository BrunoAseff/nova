"use client";

import OneTapSignIn from "@/components/OneTapSignIn";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <main className="m-0 p-0 font-montserrat">{children}</main>
      <OneTapSignIn />

      <Script src="https://accounts.google.com/gsi/client" async defer />
    </SessionProvider>
  );
}
