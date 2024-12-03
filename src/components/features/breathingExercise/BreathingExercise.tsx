import { Button } from "@/components/nova/buttons/Button";
import type { breathingExerciseProps } from "@/types";
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
  // technique type is "4-7-8" | "Box Breathing" | "Alternate Nostril Breathing" | "Wim Hof Method"

  const [isExerciseRunning, setIsExerciseRunning] = useState(false);

  if (isHidden) return null;

  return (
    <div className="fixed left-1/2 top-1/2 flex h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full bg-muted p-10 font-montserrat text-foreground">
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
        <div className="flex w-fit flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h1 className="font-delius text-4xl font-semibold text-secondary">
              Breathing Exercise
            </h1>
            <p className="text-md italic text-foreground">
              Scientifically-backed breathing exercises
            </p>
            <Image
              src={`/illustrations/breathing-exercise.svg`}
              alt="Breathing Exercise illustration"
              width={300}
              height={300}
            />
          </div>
          <Button onClick={() => setIsExerciseRunning(!isExerciseRunning)}>
            Start
          </Button>
        </div>
      )}
    </div>
  );
}
