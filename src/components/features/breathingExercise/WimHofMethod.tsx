import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WimHofMethod() {
  const [phase, setPhase] = useState<"breathe" | "hold" | "recovery">(
    "breathe",
  );
  const [countdown, setCountdown] = useState(30); // Default to 30 breaths in the breathing phase

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (phase) {
        case "breathe":
          if (countdown > 1) {
            setCountdown(countdown - 1);
          } else {
            setPhase("hold");
            setCountdown(60); // Retention lasts 60 seconds
          }
          break;
        case "hold":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("recovery");
            setCountdown(15); // Recovery breath lasts 15 seconds
          }
          break;
        case "recovery":
          if (countdown > 0) {
            setCountdown(countdown - 1);
          } else {
            setPhase("breathe");
            setCountdown(30); // Restart the cycle
          }
          break;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const phaseText = {
    breathe: "Breathe deeply (30 breaths)",
    hold: "Hold your breath",
    recovery: "Recovery breath",
  };

  const circleVariants = {
    breathe: {
      scale: 1.2,
      backgroundColor: "var(--secondary-smooth-500)",
      transition: { duration: 1, repeat: 30, repeatType: "mirror" as const },
    },
    hold: {
      scale: 1,
      backgroundColor: "var(--secondary-smooth-700)",
      transition: { duration: 60 },
    },
    recovery: {
      scale: 1.5,
      backgroundColor: "var(--secondary-smooth-500)",
      transition: { duration: 15 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-background">
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
