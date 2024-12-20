"use client";

import Space from "@/components/features/Space";
import { SessionProvider } from "next-auth/react";

export default function SpacesPage() {
  return (
    <SessionProvider>
      <Space />
    </SessionProvider>
  );
}
