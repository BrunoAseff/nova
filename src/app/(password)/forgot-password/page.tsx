"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleNotch, EnvelopeSimple } from "@phosphor-icons/react";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";

const resetSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .min(1, { message: "Email is required." }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResetFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="relative flex size-full h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-4 md:p-10">
        <div className="z-50 m-auto flex w-full flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-6 shadow-[0px_20px_207px_10px] shadow-secondary/60 md:max-w-[450px] md:p-10">
          <h1 className="text-md mb-2 font-bold md:text-2xl">
            Check your email
          </h1>
          <p className="text-center text-xs text-muted-foreground md:text-sm">
            If an account exists for
            <span className="text-foreground"> {submittedEmail}</span>,
            we&apos;ve sent
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
    <main className="relative flex size-full h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-4 md:p-10">
      <div className="z-50 m-auto flex w-full flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-6 shadow-[0px_20px_207px_10px] shadow-secondary/60 md:max-w-[450px] md:p-10">
        <h1 className="text-md mb-2 font-bold md:text-2xl">
          Reset your password
        </h1>
        <p className="mb-6 text-center text-xs text-muted-foreground md:text-sm">
          Enter your email address and we&apos;ll send you
          <br />
          instructions to reset your password.
        </p>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
        </Form>
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
