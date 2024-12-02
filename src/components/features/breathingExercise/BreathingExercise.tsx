import { Button } from "@/components/nova/buttons/Button";
import type { breathingExerciseProps } from "@/types";
import BoxBreathing from "./BoxBreathing";
import { useState } from "react";

export default function BreathingExercise({
  isHidden,
  technique,
}: breathingExerciseProps) {
  // technique type is "4-7-8" | "Box Breathing" | "Alternate Nostril Breathing" | "Wim Hof Method"

  const [isExerciseRunning, setIsExerciseRunning] = useState(false);

  if (isHidden) return null;

  return (
    <div className="fixed left-1/2 top-1/2 flex h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-full bg-secondary-smooth-700/30 text-foreground">
      {isExerciseRunning ? (
        <div>{technique === "Box Breathing" && <BoxBreathing />}</div>
      ) : (
        <Button onClick={() => setIsExerciseRunning(!isExerciseRunning)}>
          Start
        </Button>
      )}
    </div>
  );
}
