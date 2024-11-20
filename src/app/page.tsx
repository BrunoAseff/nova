"use client";
import Logo from "@/components/nova/logo";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/ui/BlurFade";
import { Star } from "@/components/icons/Star";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <BlurFade
        className="flex flex-col items-center justify-center gap-4 px-12 py-16 md:px-4"
        delay={0.25 * 3}
        inView
      >
        <Logo />

        <p className="italic text-foreground">
          A platform that helps you shine through focus and calm.
        </p>
      </BlurFade>
      <BlurFade className="relative mb-12" delay={0.25 * 4} inView>
        <div className="absolute -inset-2 rounded-lg bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary opacity-50 blur-2xl"></div>
        <Image
          className="relative rounded-lg"
          src="/backgrounds/home.webp"
          alt="Nova"
          placeholder="blur"
          blurDataURL="/blur/blurTestImage.png"
          width={450}
          height={450}
        />
      </BlurFade>
      <BlurFade
        className="flex flex-col items-center gap-4"
        delay={0.25 * 5}
        inView
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          whileDrag={{ scale: 0.9, rotate: 10 }}
          drag
          className="group relative mx-auto mt-4 w-fit overflow-hidden rounded-full border border-blue-500/20 bg-blue-500/10 transition-colors duration-200 ease-in-out"
        >
          <Link
            href="/spaces"
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
            className="flex items-center font-open text-sm font-light text-secondary-foreground"
            href="/spaces"
          >
            Continue without login
          </Link>
        </LinkBtn>
      </BlurFade>
    </main>
  );
}
