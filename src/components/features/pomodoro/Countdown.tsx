import { CyclesContext } from "@/contexts/cycleContext";
import { useSpacesContext } from "@/contexts/spaceContext";
import { useCallback, useContext, useEffect, useRef, memo } from "react";

// Separate the display component to prevent unnecessary re-renders
const TimeDisplay = memo(function TimeDisplay({
  minutes,
  seconds,
}: {
  minutes: string;
  seconds: string;
}) {
  return (
    <div className="flex items-center space-x-2 rounded-3xl text-center font-montserrat text-7xl font-[500] tabular-nums text-foreground md:text-8xl">
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <span>:</span>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </div>
  );
});

export function Countdown() {
  // Split context into separate variables to prevent unnecessary re-renders
  const {
    activeCycle,
    currentTab,
    isPaused,
    setSecondsPassed,
    amountSecondsPassed,
    toggleTab,
    togglePause,
  } = useContext(CyclesContext);

  const { spaces, selectedTab, playPomodoroAlarm } = useSpacesContext();

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Memoize space settings
  const currentSpace = spaces.find((space) => space.id === selectedTab);
  const shortBreakDuration = currentSpace?.pomodoro.shortBreakDuration ?? 5;
  const longBreakDuration = currentSpace?.pomodoro.longBreakDuration ?? 15;
  const autoStart = currentSpace?.pomodoro.autoStart ?? false;

  // Memoize total seconds calculation
  const totalSeconds = useCallback(() => {
    switch (currentTab) {
      case "Focus":
        return (activeCycle?.minutesAmount ?? 25) * 60;
      case "Long Break":
        return longBreakDuration * 60;
      default: // Short Break
        return shortBreakDuration * 60;
    }
  }, [
    activeCycle?.minutesAmount,
    currentTab,
    longBreakDuration,
    shortBreakDuration,
  ])();

  // Memoize the timer update callback
  const updateTimer = useCallback(() => {
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
  }, [
    totalSeconds,
    toggleTab,
    playPomodoroAlarm,
    autoStart,
    togglePause,
    setSecondsPassed,
  ]);

  useEffect(() => {
    if (!isPaused) {
      lastTickRef.current = Date.now();
    }

    if (activeCycle && !isPaused) {
      intervalRef.current = window.setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeCycle, isPaused, updateTimer]);

  // Calculate time values only when needed
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;
  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  // Update document title
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - Nova`;
    }
  }, [minutes, seconds, activeCycle]);

  // Only render TimeDisplay component with the values it needs
  return <TimeDisplay minutes={minutes} seconds={seconds} />;
}
