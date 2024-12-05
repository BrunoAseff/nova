import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AlternateNostril() {
  const [phase, setPhase] = useState<
    "inhale-left" | "exhale-right" | "inhale-right" | "exhale-left"
  >("inhale-left");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (phase) {
        case "inhale-left":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("exhale-right");
            setCountdown(4);
          }
          break;
        case "exhale-right":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("inhale-right");
            setCountdown(4);
          }
          break;
        case "inhale-right":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("exhale-left");
            setCountdown(4);
          }
          break;
        case "exhale-left":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("inhale-left");
            setCountdown(4);
          }
          break;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const phaseText = {
    "inhale-left": "Inhale through the left nostril",
    "exhale-right": "Exhale through the right nostril",
    "inhale-right": "Inhale through the right nostril",
    "exhale-left": "Exhale through the left nostril",
  };

  const circleVariants = {
    "inhale-left": {
      scale: 1.5,
      backgroundColor: "#ADD8E6",
      transition: { duration: 4, ease: "easeInOut" },
    },
    "exhale-right": {
      scale: 1,
      backgroundColor: "#FFD700",
      transition: { duration: 4, ease: "easeInOut" },
    },
    "inhale-right": {
      scale: 1.5,
      backgroundColor: "#90EE90",
      transition: { duration: 4, ease: "easeInOut" },
    },
    "exhale-left": {
      scale: 1,
      backgroundColor: "#FFB6C1",
      transition: { duration: 4, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full"
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
