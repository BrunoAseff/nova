import { useSpacesContext } from "@/contexts/spaceContext";
import { useCycleStore } from "@/stores/useCycleStore";
import { useCallback, useEffect, useRef, memo } from "react";

// Separate the display component remains the same
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
  const activeCycle = useCycleStore((state) => state.activeCycle);
  const currentTab = useCycleStore((state) => state.currentTab);
  const isPaused = useCycleStore((state) => state.isPaused);
  const setSecondsPassed = useCycleStore((state) => state.setSecondsPassed);
  const amountSecondsPassed = useCycleStore(
    (state) => state.amountSecondsPassed,
  );
  const toggleTab = useCycleStore((state) => state.toggleTab);
  const togglePause = useCycleStore((state) => state.togglePause);

  const { spaces, selectedTab, playPomodoroAlarm } = useSpacesContext();

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const currentSpace = spaces.find((space) => space.id === selectedTab);
  const shortBreakDuration = currentSpace?.pomodoro.shortBreakDuration ?? 5;
  const longBreakDuration = currentSpace?.pomodoro.longBreakDuration ?? 15;
  const autoStart = currentSpace?.pomodoro.autoStart ?? false;

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

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const elapsedTime = now - lastTickRef.current;

    // Only update if at least 1 second has passed
    if (elapsedTime >= 1000) {
      // Calculate how many whole seconds have passed
      const deltaSeconds = Math.floor(elapsedTime / 1000);

      // Update the last tick time by the exact number of seconds processed
      lastTickRef.current = now - (elapsedTime % 1000);

      setSecondsPassed((prev: number) => {
        const newSeconds = prev + deltaSeconds;

        if (newSeconds >= totalSeconds) {
          // Clear interval and handle session completion
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toggleTab();
          playPomodoroAlarm();

          if (!autoStart) {
            togglePause();
          }
          return 0;
        }

        return newSeconds;
      });
    }
  }, [
    totalSeconds,
    setSecondsPassed,
    toggleTab,
    playPomodoroAlarm,
    autoStart,
    togglePause,
  ]);

  useEffect(() => {
    if (activeCycle && !isPaused) {
      // Reset lastTickRef when starting or unpausing
      lastTickRef.current = Date.now();

      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new interval - checking more frequently for accuracy
      intervalRef.current = window.setInterval(updateTimer, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeCycle, isPaused, updateTimer]);

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

  return <TimeDisplay minutes={minutes} seconds={seconds} />;
}
