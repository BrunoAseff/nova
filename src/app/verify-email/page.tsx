"use client";

import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Mailbox } from "@phosphor-icons/react";

export default function VerifyEmail() {
  return (
    <main className="relative flex size-full h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-20">
      <div className="z-50 m-auto flex flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-10 shadow-[0px_20px_207px_10px] shadow-secondary/60">
        <h1 className="mb-4 text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          A sign in link has been sent to your email address.
          <br />
          Please check your inbox and spam folder.
        </p>
        <Mailbox className="mt-6 text-secondary" weight="thin" size={100} />
      </div>
      <DotPattern
        width={50}
        height={50}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1300px_circle_at_center,white,transparent)]",
        )}
      />
    </main>
  );
}
