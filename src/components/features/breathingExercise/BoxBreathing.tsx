import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BoxBreathing() {
  const [phase, setPhase] = useState<
    "inhale" | "hold-full" | "exhale" | "hold-empty"
  >("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (phase) {
        case "inhale":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("hold-full");
            setCountdown(4);
          }
          break;
        case "hold-full":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("exhale");
            setCountdown(4);
          }
          break;
        case "exhale":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("hold-empty");
            setCountdown(4);
          }
          break;
        case "hold-empty":
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
    "hold-full": "Hold",
    exhale: "Exhale",
    "hold-empty": "Hold",
  };

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    "hold-full": {
      scale: 1.5,
      transition: { duration: 4 },
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" },
    },
    "hold-empty": {
      scale: 1,
      transition: { duration: 4 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full bg-background/20"
        variants={circleVariants}
        animate={phase}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {phaseText[phase]}
          </div>
          <div className="text-4xl font-bold text-foreground">{countdown}</div>
        </div>
      </motion.div>
    </div>
  );
}
