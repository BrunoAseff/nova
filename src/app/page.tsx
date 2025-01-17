"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "@/components/icons/Star";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";
import { motion } from "framer-motion";
import Logo from "@/components/nova/Logo";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0c0e12]">
      <div className="flex flex-col items-center justify-center gap-4 px-12 py-16 md:px-4">
        <Logo />

        <p className="italic text-[#d0dbe3]">
          A platform that helps you shine through focus and calm.
        </p>
      </div>
      <div className="relative mb-12">
        <div className="absolute -inset-2 rounded-lg bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary opacity-50 blur-2xl"></div>
        <Image
          className="relative rounded-lg"
          src="https://utfs.io/f/C3k2e5UQDa97y2SOkr9cqGPsb7SQOBHKydVteUNn3roRwFiI"
          alt="Nova"
          placeholder="blur"
          blurDataURL="/blur/blurTestImage.png"
          width={450}
          height={450}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          whileDrag={{ scale: 0.9, rotate: 10 }}
          drag
          className="group relative mx-auto mt-4 w-fit overflow-hidden rounded-full border border-blue-500/20 bg-blue-500/10 text-[#d0dbe3]/90 transition-colors duration-200 ease-in-out"
        >
          <Link
            href="/sign-in"
            className="relative flex items-center gap-2 px-8 py-3"
          >
            <span className="text-sm font-medium">Get Started</span>
            <Star className="h-4 w-4" />
            <div className="absolute bottom-0 left-0 right-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-secondary-smooth-500 to-transparent transition-all duration-200 group-hover:via-secondary-smooth-400" />
          </Link>
        </motion.button>
        <LinkBtn>
          {" "}
          <Link
            className="flex items-center font-open text-sm font-light text-[#d0dbe3]"
            href="/spaces"
          >
            Continue without login
          </Link>
        </LinkBtn>
      </div>
    </main>
  );
}
