import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FourSevenEight() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (phase) {
        case "inhale":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("hold");
            setCountdown(7);
          }
          break;
        case "hold":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("exhale");
            setCountdown(8);
          }
          break;
        case "exhale":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("inhale");
            setCountdown(4);
          }
          break;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const phaseText = {
    inhale: "Inhale",
    hold: "Hold",
    exhale: "Exhale",
  };

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    hold: {
      scale: 1.5,
      transition: { duration: 7 },
    },
    exhale: {
      scale: 1,
      transition: { duration: 8, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full bg-background/20"
        variants={circleVariants}
        animate={phase}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-foreground">
            {phaseText[phase]}
          </div>
          <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-background bg-background/10 text-3xl font-bold text-background">
            {countdown}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
