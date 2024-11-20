"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-foreground">
        Page Not Found
      </h1>
      <Image
        src="/illustrations/404.svg"
        alt="Page Not Found"
        width={400}
        height={300}
      />
      <p className="mb-6 text-foreground">
        The page you are looking for might have been removed or does not exist.
      </p>
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
          <span className="text-sm font-medium">Return to your spaces</span>
          <div className="absolute bottom-0 left-0 right-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-secondary-smooth-500 to-transparent transition-all duration-200 group-hover:via-secondary-smooth-400" />
        </Link>
      </motion.button>
    </div>
  );
}
