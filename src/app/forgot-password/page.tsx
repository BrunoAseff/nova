"use client";

import { useState } from "react";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { CircleNotch, EnvelopeSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="relative flex size-full h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-10">
        <div className="z-50 m-auto flex max-w-[450px] flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-10 shadow-[0px_20px_207px_10px] shadow-secondary/60">
          <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
          <p className="text-center text-sm text-muted-foreground">
            If an account exists for
            <span className="text-foreground"> {email}</span>, we&apos;ve sent
            <br />
            password reset instructions.
          </p>
          <EnvelopeSimple
            className="mt-6 text-secondary"
            weight="thin"
            size={100}
          />
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

  return (
    <main className="relative flex size-full h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-20">
      <div className="z-50 m-auto flex max-w-[450px] flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-10 shadow-[0px_20px_207px_10px] shadow-secondary/60">
        <h1 className="mb-2 text-2xl font-bold">Reset your password</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you
          <br />
          instructions to reset your password.
        </p>
        <form
          onSubmit={onSubmit}
          className="w-full items-center justify-center space-y-6"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex w-full items-center justify-center">
            <PrimaryBtn disabled={isLoading} type="submit">
              {isLoading ? (
                <div className="flex items-center justify-around gap-1">
                  <CircleNotch className="animate-spin" size={18} />
                  <p>Send email</p>
                </div>
              ) : (
                "Send email"
              )}
            </PrimaryBtn>
          </div>
        </form>
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
