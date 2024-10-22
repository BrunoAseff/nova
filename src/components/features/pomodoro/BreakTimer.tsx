import { useContext } from "react";
import { CyclesContext } from "@/contexts/cycleContext";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { Pause } from "@/components/icons/pause";
import { Stop } from "@/components/icons/Stop";
import { Play } from "@/components/icons/Play";
import SecondaryBtn from "@/components/nova/buttons/SecondaryBtn";

interface BreakTimerProps {
  totalSeconds: number;
}

export default function BreakTimer({ totalSeconds }: BreakTimerProps) {
  const { activeCycle, isPaused, togglePause, interruptCurrentCycle } =
    useContext(CyclesContext);

  const currentSeconds = totalSeconds;
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;

  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return (
    <div className="text-md flex flex-col items-center gap-10 rounded-3xl bg-background p-6 text-center font-open font-extralight text-foreground">
      <div className="flex items-center space-x-1 rounded-3xl text-center font-open text-8xl font-extralight text-foreground">
        <span>{minutesStr[0]}</span>
        <span>{minutesStr[1]}</span>
        <span>:</span>
        <span>{secondsStr[0]}</span>
        <span>{secondsStr[1]}</span>
      </div>

      <div className="flex gap-4">
        {activeCycle ? (
          <>
            {isPaused ? (
              <IconBtn onClick={togglePause}>
                <Play />
              </IconBtn>
            ) : (
              <IconBtn onClick={togglePause}>
                <Pause />
              </IconBtn>
            )}
            <IconBtn onClick={interruptCurrentCycle} variant="destructive">
              <Stop />
            </IconBtn>
          </>
        ) : (
          <SecondaryBtn>
            <Play />
            Start
          </SecondaryBtn>
        )}
      </div>
    </div>
  );
}
