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
    "inhale-left": "Inhale",
    "exhale-right": "Exhale",
    "inhale-right": "Inhale",
    "exhale-left": "Exhale",
  };

  const circleVariants = {
    "inhale-left": {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    "exhale-right": {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" },
    },
    "inhale-right": {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" },
    },
    "exhale-left": {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" },
    },
  };

  const getnostrilText = () => {
    switch (phase) {
      case "inhale-left":
      case "exhale-left":
        return "through the left nostril";
      case "inhale-right":
      case "exhale-right":
        return "through the right nostril";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full bg-background/20"
        variants={circleVariants}
        animate={phase}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-xl font-semibold text-foreground">
              {phaseText[phase]}
            </div>
            <p className="text-sm text-foreground/80">
              {getnostrilText()}
            </p>
          </div>
          <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-background bg-background/10 text-xl font-bold text-background">
            {countdown}
          </div>
        </div>
      </motion.div>
    </div>
  );
}