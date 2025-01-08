import { CyclesContext } from "@/contexts/cycleContext";
import { useSpacesContext } from "@/contexts/spaceContext";
import { useContext, useEffect, useRef } from "react";

export function Countdown() {
  const {
    activeCycle,
    currentTab,
    isPaused,
    setSecondsPassed,
    amountSecondsPassed,
    toggleTab,
    increaseCycleCounter,
    togglePause,
  } = useContext(CyclesContext);

  const { spaces, selectedTab, playPomodoroAlarm, stopPomodoroAlarm } =
    useSpacesContext();

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Get the short and long break durations from the current tab's space
  const currentSpace = spaces.find((space) => space.id === selectedTab);
  const shortBreakDuration = currentSpace?.pomodoro.shortBreakDuration ?? 5;
  const longBreakDuration = currentSpace?.pomodoro.longBreakDuration ?? 15;
  const autoStart = currentSpace?.pomodoro.autoStart ?? false;

  // Get total seconds based on current tab
  const totalSeconds = (() => {
    switch (currentTab) {
      case "Focus":
        return (activeCycle?.minutesAmount ?? 25) * 60;
      case "Long Break":
        return longBreakDuration * 60;
      default: // Short Break
        return shortBreakDuration * 60;
    }
  })();

  useEffect(() => {
    // Reset lastTickRef when pause state changes
    if (!isPaused) {
      lastTickRef.current = Date.now();
    }

    if (activeCycle && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastTickRef.current) / 1000);
        lastTickRef.current = now;

        if (deltaSeconds > 0) {
          setSecondsPassed((seconds: number) => {
            const newTime = seconds + deltaSeconds;
            if (newTime >= totalSeconds) {
              clearInterval(intervalRef.current!);

              toggleTab();
              playPomodoroAlarm();

              if (!autoStart) {
                togglePause();
              }
              return 0;
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    activeCycle,
    playPomodoroAlarm,
    isPaused,
    totalSeconds,
    setSecondsPassed,
    toggleTab,
    increaseCycleCounter,
    selectedTab,
    spaces,
    autoStart,
    togglePause,
    stopPomodoroAlarm,
  ]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
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
    <div className="flex items-center space-x-1 rounded-3xl text-center font-montserrat text-8xl font-medium tabular-nums text-foreground">
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <span>:</span>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </div>
  );
}
