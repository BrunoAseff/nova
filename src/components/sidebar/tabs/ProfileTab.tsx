import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion";
import { TabHeader } from "@/components/tabHeader";
import ProfileIllustration from "@/components/svgs/ProfileIllustration";
import { signOut, useSession } from "next-auth/react";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";

export default function ProfileTab() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main className="h-screen min-w-full">
        <TabHeader
          title="Profile"
          subtitle="Manage and customize your personal profile details."
          Icon={ProfileIllustration}
        />
        <div className="mx-auto mt-32 flex h-full w-full flex-col gap-6">
          <div className="flex min-h-10 w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                {" "}
                <Label className="text-md font-montserrat text-foreground">
                  Email
                </Label>
                <p>{session.user.email} </p>
              </div>
              <div className="flex flex-col gap-1">
                {" "}
                <Label className="text-md font-montserrat text-foreground">
                  Username
                </Label>
                <p>{session.user.name} </p>
              </div>
            </div>
          </div>

          <PrimaryBtn onClick={() => signOut()}>Sign Out</PrimaryBtn>
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
      <div className="mx-auto mt-32 flex h-full w-full flex-col gap-6">
        <div className="via mt-6 flex min-h-10 w-full flex-col items-center gap-6 space-x-2 rounded-2xl border-[1px] border-secondary/60 bg-background p-4 shadow-[0px_20px_100px_10px_rgba(87,_171,_255,_0.48)]">
          <Label className="text-md px-3 font-montserrat text-foreground">
            Login or create an account to have a complete experience
          </Label>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            whileDrag={{ scale: 0.9, rotate: 10 }}
            drag
            className="group relative mx-auto mt-4 w-fit overflow-hidden rounded-full border border-blue-500/20 bg-background transition-colors duration-200 ease-in-out"
          >
            <Link
              href="/sign-in"
              className="relative flex items-center gap-2 px-8 py-3"
            >
              <span className="text-sm font-medium text-secondary">
                Enter now
              </span>

              <div className="absolute bottom-0 left-0 right-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-secondary-smooth-500 to-transparent transition-all duration-200 group-hover:via-secondary-smooth-400" />
            </Link>
          </motion.button>{" "}
        </div>
      </div>
    </main>
  );
}
