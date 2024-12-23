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
    breathe: "Breathe deeply",
    hold: "Hold your breath",
    recovery: "Recovery breath",
  };

  const circleVariants = {
    breathe: {
      scale: 1.2,
      transition: { duration: 1, repeat: 30, repeatType: "mirror" as const },
    },
    hold: {
      scale: 1,
      transition: { duration: 60 },
    },
    recovery: {
      scale: 1.5,
      transition: { duration: 15 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full bg-[#0c0e12]/20"
        variants={circleVariants}
        animate={phase}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-xl font-semibold text-[#d0dbe3]">
              {phaseText[phase]}
            </div>
            <p className="text-sm text-[#d0dbe3]/80">
              {phase === "breathe" ? "(do 30 breaths)" : null}
            </p>
          </div>
          <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-[#0c0e12] bg-[#0c0e12]/10 text-xl font-bold text-[#0c0e12]">
            {countdown}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
