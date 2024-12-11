import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion";
import { TabHeader } from "@/components/tabHeader";
import ProfileIllustration from "@/components/svgs/ProfileIllustration";

export default function ProfileTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Profile"
        subtitle="Manage and customize your personal profile details."
        Icon={ProfileIllustration}
      />
      <div className="mx-auto mt-32 flex h-full w-full flex-col gap-6">
        <div className="via mt-6 flex min-h-10 w-full flex-col items-center justify-between gap-6 space-x-2 rounded-2xl border-[1px] border-accent bg-gradient-to-tl from-primary via-secondary-smooth-500 to-secondary-smooth-700 p-4">
          <Label className="font-montserrat text-lg text-background">
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
              href="/spaces"
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
