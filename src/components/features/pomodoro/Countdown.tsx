import { CyclesContext } from "@/contexts/cycleContext";
import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
    isPaused, // Get the pause state
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeCycle && !isPaused) {
      // Only run if not paused
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentAsFinished,
    setSecondsPassed,
    isPaused, // Add pause dependency to rerun on pause toggle
  ]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes} : ${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <div className="flex items-center space-x-1 rounded-3xl text-center font-open text-8xl font-extralight text-foreground">
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <span>:</span>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </div>
  );
}
