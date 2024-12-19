import { Button } from "@/components/nova/buttons/Button";
import type { breathingExerciseProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

import BoxBreathing from "./BoxBreathing";
import React, { useState } from "react";
import FourSevenEight from "./FourSevenEight";
import AlternateNostril from "./AlternateNostril";
import WimHofMethod from "./WimHofMethod";
import BreathingExerciseIllustration from "@/components/svgs/BreathingExerciseIllustration";

export default function BreathingExercise({
  isHidden,
  technique,
}: breathingExerciseProps) {
  const [isExerciseRunning, setIsExerciseRunning] = useState(false);

  if (isHidden) return null;

  const floatingVariants: Variants = {
    initial: { y: 0 },
    float: {
      y: [-20, 0, -20],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const techniqueComponents = {
    "Box Breathing": BoxBreathing,
    "4-7-8": FourSevenEight,
    "Alternate Nostril Breathing": AlternateNostril,
    "Wim Hof Method": WimHofMethod,
  };

  return (
    <div className="fixed left-1/2 top-[55%] flex h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full border-[1px] border-[#0c0e12]/60 bg-gradient-to-t from-transparent via-[#0c0e12]/30 to-[#0c0e12]/40 p-10 font-montserrat text-[#d0dbe3]">
      <AnimatePresence mode="wait">
        {!isExerciseRunning && (
          <motion.div
            key="intro"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-50 flex w-fit flex-col items-center justify-center gap-6"
          >
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <h1 className="font-delius text-3xl font-semibold text-[#d0dbe3]">
                Breathing Exercise
              </h1>
              <p className="text-md italic text-[#d0dbe3]/80">
                Scientifically-backed breathing exercises
              </p>
              <motion.div variants={floatingVariants} animate="float">
                <BreathingExerciseIllustration className="h-60 w-60 !fill-[#d0dbe3] text-[#d0dbe3]" />
              </motion.div>
            </div>
            <Button variant="dark" onClick={() => setIsExerciseRunning(true)}>
              Start
            </Button>
          </motion.div>
        )}

        {isExerciseRunning && technique in techniqueComponents && (
          <motion.div
            key="technique"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex h-full w-full flex-col items-center justify-center"
          >
            {React.createElement(techniqueComponents[technique])}
            <div className="absolute -bottom-5">
              <Button
                onClick={() => setIsExerciseRunning(false)}
                variant="dark"
              >
                Stop
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
