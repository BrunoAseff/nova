"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { CircleNotch, Key, Eye, EyeSlash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/reset-password/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error);
      }

      router.push("/sign-in?reset=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden rounded-lg bg-background p-20">
      <div className="z-50 m-auto flex w-[400px] flex-col items-center justify-center rounded-2xl border-[1px] border-secondary/60 bg-background p-10 shadow-[0px_20px_207px_10px] shadow-secondary/60">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Key className="text-secondary" size={32} />
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye
                            size={25}
                            weight="duotone"
                            className="text-foreground"
                          />
                        ) : (
                          <EyeSlash
                            size={25}
                            weight="duotone"
                            className="text-foreground"
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Confirm Password Input */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye
                            size={25}
                            weight="duotone"
                            className="text-foreground"
                          />
                        ) : (
                          <EyeSlash
                            size={25}
                            weight="duotone"
                            className="text-foreground"
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="h-2">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex w-full items-center justify-center">
              <PrimaryBtn disabled={isLoading} type="submit">
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <CircleNotch className="animate-spin" size={18} />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
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
