import { Label } from "@/components/ui/label";
import Link from "next/link";
import { TabHeader } from "@/components/tabHeader";
import ProfileIllustration from "@/components/svgs/ProfileIllustration";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  CircleNotch,
  EnvelopeSimple,
  Password,
  SignOut,
  User,
} from "@phosphor-icons/react";
import TabCard from "@/components/tabCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DangerBtn from "@/components/nova/buttons/DangerBtn";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { changeUsername, deleteUserAccount } from "@/server/actions/user";
import { z } from "zod";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long");

export default function ProfileTab() {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { data: session, update: updateSession } = useSession();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(session?.user?.name ?? "");
  const [currentUsername, setCurrentUsername] = useState(
    session?.user?.name ?? "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setCurrentUsername(session.user.name);
      setNewUsername(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (isEditingUsername !== null) {
      inputRef.current?.focus();
    }
  }, [isEditingUsername]);

  const handleUsernameChange = async () => {
    try {
      setUsernameError("");
      usernameSchema.parse(newUsername);

      setIsLoading(true);
      await changeUsername(session?.user?.id! as string, newUsername);

      await updateSession({
        ...session,
        name: newUsername,
      });

      setCurrentUsername(newUsername);
      setIsEditingUsername(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0]?.message ?? "Invalid username");
      } else {
        setUsernameError("Failed to update username");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(currentUsername);
    setUsernameError("");
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteUserAccount(session?.user?.id! as string);
      signOut({ callbackUrl: "/" }); // Redirect to home after deletion
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("dataMigrationComplete");
  };

  if (session) {
    return (
      <main className="h-screen min-w-full">
        <TabHeader
          title="Profile"
          subtitle="Manage and customize your personal profile details."
          Icon={ProfileIllustration}
        />
        <div className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent z-50 mx-auto mt-24 flex h-full max-h-[65vh] w-[145%] flex-col overflow-y-auto md:w-[160%]">
          <div className="mb-12 flex min-h-fit flex-col gap-6">
            <TabCard>
              <div className="flex w-full flex-col gap-6">
                <Label className="text-sm md:text-base">Account info</Label>
                <div className="grid w-full grid-cols-2 gap-4 p-1">
                  <div className="flex flex-col gap-1">
                    <Label className="flex items-center gap-1 font-montserrat text-sm text-muted-foreground md:text-base">
                      <EnvelopeSimple
                        size={17}
                        weight="duotone"
                        className="text-muted-foreground"
                      />
                      Email
                    </Label>
                    <Input
                      value={session.user.email ?? "failed to load your email"}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="flex items-center gap-1 font-montserrat text-sm text-muted-foreground md:text-base">
                      <User
                        size={17}
                        weight="duotone"
                        className="text-muted-foreground"
                      />
                      Username
                    </Label>
                    <Input
                      ref={inputRef}
                      className="mb-2"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      readOnly={!isEditingUsername}
                      disabled={!isEditingUsername}
                    />
                    {usernameError && (
                      <p className="text-xs text-destructive">
                        {usernameError}
                      </p>
                    )}
                    {!isEditingUsername ? (
                      <LinkBtn
                        className="w-fit text-xs text-secondary"
                        onClick={() => setIsEditingUsername(true)}
                      >
                        Change username
                      </LinkBtn>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="ghost"
                          className="text-sm"
                          onClick={handleUsernameChange}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <CircleNotch className="animate-spin" size={18} />
                          ) : (
                            "Save change"
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-sm transition-all hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {" "}
                    <Label className="flex items-center gap-1 font-montserrat text-sm text-muted-foreground md:text-base">
                      <Password
                        size={17}
                        weight="duotone"
                        className="text-muted-foreground"
                      />
                      Password
                    </Label>
                    <Input value={"*********************"} readOnly disabled />
                    <LinkBtn className="mt-2 w-fit text-xs text-secondary">
                      <Link href="/forgot-password">Forgot my password</Link>
                    </LinkBtn>
                  </div>
                  <p className="m-auto text-center text-sm text-accent-foreground md:text-base">
                    Put verification thing in here later
                  </p>
                </div>
              </div>
            </TabCard>
            <TabCard className="flex-col md:flex-row">
              <Label className="md:text- mb-2 text-sm md:mb-0">
                Log out from your account
              </Label>
              <Button
                className="flex justify-around gap-1"
                onClick={() => handleSignOut()}
              >
                Sign Out
                <SignOut size={19} />
              </Button>
            </TabCard>

            <div className="w-full">
              <Label className="mb-1 text-sm text-destructive">
                Danger Zone
              </Label>
              <TabCard className="flex-col md:flex-row" variant="danger">
                <div className="mb-2 flex w-full flex-col gap-1 md:mb-0">
                  <Label
                    htmlFor="clock-reset"
                    className="text-sm text-foreground md:text-base"
                  >
                    Delete your account
                  </Label>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                    Delete all your information.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DangerBtn>Delete account</DangerBtn>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div>
                      <Label>
                        Type &quot;delete my account&quot; to confirm.
                      </Label>
                      <Input
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="delete my account"
                        className="mt-2 focus-visible:bg-rose-900/10 focus-visible:ring-rose-500"
                      />
                    </div>
                    <AlertDialogFooter className="flex w-full items-center justify-center">
                      <AlertDialogCancel className="w-fit gap-2 rounded-3xl border-[1px] border-muted bg-background p-4 font-sans text-sm font-[500] text-foreground transition-colors hover:border-secondary hover:bg-secondary-smooth-700/10 hover:text-secondary">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={
                          isLoading ||
                          deleteConfirmation !== "delete my account"
                        }
                        className="mt-2 w-fit gap-2 rounded-3xl border-[1px] bg-foreground p-4 font-sans text-sm font-[500] text-background transition-colors hover:border-destructive hover:bg-red-700/10 hover:text-destructive disabled:opacity-50 md:mt-0"
                      >
                        {isLoading ? (
                          <CircleNotch className="animate-spin" size={18} />
                        ) : (
                          "Delete account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TabCard>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="h-screen">
      <TabHeader
        title="Profile"
        subtitle="Manage and customize your personal profile details."
        Icon={ProfileIllustration}
      />
      <div className="mx-auto mt-32 flex h-full w-[135%] flex-col gap-6 md:w-[100%]">
        <div className="via mt-6 flex min-h-16 w-full flex-col items-center gap-6 space-x-2 rounded-2xl border-[1px] border-secondary/60 bg-background p-4 shadow-[0px_20px_207px_10px] shadow-secondary/40">
          <Label className="px-3 font-montserrat text-sm text-foreground md:text-base">
            Login or create an account to have a complete experience
          </Label>
          <PrimaryBtn className="rounded-3xl p-4 text-sm">
            <Link href="/sign-in">
              <p>Enter now</p>
            </Link>
          </PrimaryBtn>
        </div>
      </div>
    </main>
  );
}
