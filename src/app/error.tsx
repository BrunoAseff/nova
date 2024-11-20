"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-4 text-3xl font-bold text-foreground">
        Something went wrong!
      </h1>
      <Image
        src="/illustrations/500.svg"
        alt="Error 500"
        width={400}
        height={300}
      />
      <p className="mb-6 text-foreground">
        We apologize for the inconvenience. Please try again or contact support.
      </p>

      <motion.button
        onClick={() => reset()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        whileDrag={{ scale: 0.9, rotate: 10 }}
        drag
        className="group relative mx-auto mt-4 w-fit overflow-hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-8 py-3 transition-colors duration-200 ease-in-out"
      >
        <span className="text-sm font-medium">Try again</span>
        <div className="absolute bottom-0 left-0 right-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-secondary-smooth-500 to-transparent transition-all duration-200 group-hover:via-secondary-smooth-400" />
      </motion.button>
    </div>
  );
}
