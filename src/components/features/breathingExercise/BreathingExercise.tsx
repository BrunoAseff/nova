import { Button } from "@/components/nova/buttons/Button";
import type { breathingExerciseProps } from "@/types";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import BoxBreathing from "./BoxBreathing";
import { useState } from "react";
import FourSevenEight from "./FourSevenEight";
import AlternateNostril from "./AlternateNostril";
import WimHofMethod from "./WimHofMethod";
import Image from "next/image";

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

  return (
    <div className="fixed left-1/2 top-[55%] flex h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full border-[1px] border-background/60 bg-gradient-to-t from-transparent via-muted/20 to-muted/50 p-10 font-montserrat text-foreground">
      {isExerciseRunning ? (
        <div>
          <div>{technique === "Box Breathing" && <BoxBreathing />}</div>
          <div>{technique === "4-7-8" && <FourSevenEight />}</div>
          <div>
            {technique === "Alternate Nostril Breathing" && (
              <AlternateNostril />
            )}
          </div>
          <div>{technique === "Wim Hof Method" && <WimHofMethod />}</div>
        </div>
      ) : (
        <div className="z-50 flex w-fit flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h1 className="font-delius text-3xl font-semibold text-foreground">
              Breathing Exercise
            </h1>
            <p className="text-md italic text-foreground/80">
              Scientifically-backed breathing exercises
            </p>
            <motion.div variants={floatingVariants} animate="float">
              <Image
                src={`/illustrations/breathing-white.svg`}
                alt="Breathing Exercise illustration"
                width={300}
                height={300}
              />
            </motion.div>
          </div>
          <Button
            variant="dark"
            onClick={() => setIsExerciseRunning(!isExerciseRunning)}
          >
            Start
          </Button>
        </div>
      )}
    </div>
  );
}
