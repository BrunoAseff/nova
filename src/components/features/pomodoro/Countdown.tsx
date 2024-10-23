import { CyclesContext } from "@/contexts/cycleContext";
import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    setSecondsPassed,
    isPaused,
    totalPausedTime,
    currentTab,
    toggleTab,
    increaseCycleCounter,
  } = useContext(CyclesContext);

  let totalSeconds: number;

  if (currentTab === "Focus") {
    totalSeconds = (activeCycle ? activeCycle.minutesAmount : 25) * 60;
  } else if (currentTab === "LongBreak") {
    totalSeconds = 15 * 60;
  } else {
    totalSeconds = 5 * 60;
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeCycle && !isPaused) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        );

        // Only subtract pause time during Focus sessions
        const adjustedDifference =
          currentTab === "Focus"
            ? secondsDifference - totalPausedTime
            : secondsDifference;

        if (adjustedDifference >= totalSeconds) {
          toggleTab();
          increaseCycleCounter();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(adjustedDifference);
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
    setSecondsPassed,
    isPaused,
    totalPausedTime,
    toggleTab,
    increaseCycleCounter,
    currentTab,
  ]);

  const currentSeconds = activeCycle
    ? totalSeconds -
      (currentTab === "Focus"
        ? amountSecondsPassed
        : amountSecondsPassed % totalSeconds)
    : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - Nova`;
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
