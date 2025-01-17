"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CircleNotch, Eye, EyeSlash } from "@phosphor-icons/react";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { signUp } from "@/server/actions/signUp";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";
import Logo from "@/components/nova/Logo";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = loginSchema.extend({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/spaces");
    }
  }, [session, router]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      acceptTerms: false,
    },
  });

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    setAuthError(null); // Clear previous errors
    setIsLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (!result || !result.ok) {
        throw new Error(result?.error ?? "Login failed");
      }

      // Redirect on success
      router.push("/spaces");
    } catch (error) {
      setAuthError((error as Error).message);
      console.error(error);
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function handleSignUp(data: z.infer<typeof signUpSchema>) {
    setAuthError(null);
    setIsSignUpLoading(true);

    try {
      const signUpResult = await signUp({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      if (!signUpResult.success) {
        throw new Error(signUpResult.error);
      }

      const verificationResult = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/spaces",
      });

      if (verificationResult?.ok) {
        router.push("/verify-email");
      } else {
        setAuthError(
          "Account created but verification email failed. Please try logging in and requesting a new verification email.",
        );
      }
    } catch (error) {
      setAuthError((error as Error).message ?? "Signup failed");
      console.error(error);
    } finally {
      setIsSignUpLoading(false);
    }
  }
  const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-6 space-y-2">
      <div className="flex items-center justify-between">{children}</div>
    </div>
  );
  return (
    <main className="relative flex size-full h-screen items-center justify-center overflow-hidden overflow-y-auto rounded-lg bg-background p-6 md:p-20">
      <div className="z-50 m-auto h-fit w-full rounded-2xl border-[1px] border-secondary/60 bg-background px-4 shadow-[0px_20px_207px_10px] shadow-secondary/60 md:w-[36rem]">
        <div className="flex flex-col items-center px-4 pb-10 pt-3">
          <div className="scale-80 mb-4">
            <Logo />
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6 flex justify-center">
              <TabsTrigger
                className="rounded-none border-[2px] border-background data-[state=active]:border-b-foreground data-[state=active]:text-foreground"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-[2px] border-background data-[state=active]:border-b-foreground data-[state=active]:text-foreground"
                value="signUp"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="mb-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-[1px] border-muted bg-muted text-foreground transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary md:h-[3.5rem]"
              >
                <SiGoogle size={18} />
                <p className="text-md font-medium md:text-lg">
                  Login with Google{" "}
                </p>
              </button>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-6"
                >
                  <div>
                    {authError && (
                      <p className="md:text-md text-xs text-destructive">
                        {authError}
                      </p>
                    )}
                  </div>
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldWrapper>
                          <FormLabel>Email</FormLabel>
                          <FormMessage />
                        </FormFieldWrapper>
                        <FormControl>
                          <Input placeholder="example@example.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldWrapper>
                          <FormLabel>Password</FormLabel>
                          <FormMessage />
                        </FormFieldWrapper>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
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
                                  className="mr-2 text-foreground"
                                />
                              ) : (
                                <EyeSlash
                                  size={25}
                                  weight="duotone"
                                  className="mr-2 text-foreground"
                                />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <LinkBtn className="mt-2 w-fit text-xs text-secondary">
                          <Link href="/forgot-password">
                            Forgot my password
                          </Link>
                        </LinkBtn>
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full items-center justify-center">
                    <PrimaryBtn disabled={isLoginLoading} type="submit">
                      {isLoginLoading ? (
                        <div className="flex items-center justify-around gap-1">
                          <CircleNotch className="animate-spin" size={18} />
                          <p>Log in</p>
                        </div>
                      ) : (
                        "Log In"
                      )}
                    </PrimaryBtn>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Sign-Up Tab */}
            <TabsContent value="signUp">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="mb-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border-[1px] border-muted bg-muted text-foreground transition-all hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary md:h-[3.5rem]"
              >
                <SiGoogle size={18} />
                <p className="text-md font-medium md:text-lg">
                  Login with Google{" "}
                </p>
              </button>
              <Form {...signUpForm}>
                <form
                  onSubmit={signUpForm.handleSubmit(handleSignUp)}
                  className="space-y-6"
                >
                  <div>
                    {authError && (
                      <p className="md:text-md text-xs text-destructive">
                        {authError}
                      </p>
                    )}
                  </div>
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldWrapper>
                          <FormLabel>Username</FormLabel>
                          <FormMessage />
                        </FormFieldWrapper>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldWrapper>
                          <FormLabel>Email</FormLabel>
                          <FormMessage />
                        </FormFieldWrapper>
                        <FormControl>
                          <Input placeholder="example@example.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormFieldWrapper>
                          <FormLabel>Password</FormLabel>
                          <FormMessage />
                        </FormFieldWrapper>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
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
                                  className="mr-2 text-foreground"
                                />
                              ) : (
                                <EyeSlash
                                  size={25}
                                  weight="duotone"
                                  className="mr-2 text-foreground"
                                />
                              )}
                            </button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex w-full flex-col">
                            <FormLabel className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-sm">
                              I accept the{" "}
                              <Link
                                className="underline"
                                href="/terms-of-service"
                              >
                                terms and conditions
                              </Link>
                            </FormLabel>
                          </div>
                        </div>
                        <div className="min-h-6">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full items-center justify-center">
                    <PrimaryBtn disabled={isSignUpLoading} type="submit">
                      {isSignUpLoading ? (
                        <div className="flex items-center justify-around gap-1">
                          <CircleNotch className="animate-spin" size={18} />
                          <p>Sign Up</p>
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </PrimaryBtn>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <DotPattern
        width={50}
        height={50}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "hidden [mask-image:radial-gradient(1300px_circle_at_center,white,transparent)] md:block",
        )}
      />
    </main>
  );
}
