"use client";
import { createContext, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { differenceInSeconds } from "date-fns";
import type { Cycle } from "@/reducers/cycles/cycleReducer";
import { cyclesReducer } from "@/reducers/cycles/cycleReducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
  updateCycleStartDateAction,
} from "@/reducers/cycles/cycleActions";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface PomodoroStats {
  cyclesCompleted: number;
  startedAt: Date | null;
  focusedTimeInSeconds: number;
  breakTimeInSeconds: number;
}

interface CyclesContextType {
  // Core Pomodoro State
  cycles: Array<Cycle>;
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  currentTab: string;
  isPaused: boolean;
  totalPausedTime: number;
  amountSecondsPassed: number;
  cycleCounter: number;
  focusingOnMessage: string;

  // Stats
  stats: PomodoroStats;

  // Actions
  markCurrentAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  togglePause: () => void;
  falsePause: () => void;
  toggleTab: () => void;
  increaseCycleCounter: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });

  const [currentTab, setCurrentTab] = useState("Focus");
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStart, setPauseStart] = useState<Date | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [focusingOnMessage, setfocusingOnMessage] = useState("");
  const [cycleCounter, setCycleCounter] = useState(0);
  const [stats, setStats] = useState<PomodoroStats>({
    cyclesCompleted: 0,
    startedAt: null,
    focusedTimeInSeconds: 0,
    breakTimeInSeconds: 0,
  });

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  function increaseCycleCounter() {
    if (cycleCounter === 4) {
      setCycleCounter(0);
      setStats((prev) => ({
        ...prev,
        cyclesCompleted: prev.cyclesCompleted + 1,
      }));
    } else {
      setCycleCounter((prev) => prev + 1);
    }
  }

  function toggleTab() {
    if (activeCycle) {
      const updatedCycle = { ...activeCycle, startDate: new Date() };
      dispatch(updateCycleStartDateAction(updatedCycle));

      // Calculate time spent in previous tab
      const timeInPreviousTab =
        differenceInSeconds(new Date(), new Date(activeCycle.startDate)) -
        totalPausedTime;

      // Update focused or break time based on current tab
      setStats((prev) => ({
        ...prev,
        focusedTimeInSeconds:
          currentTab === "Focus"
            ? prev.focusedTimeInSeconds + timeInPreviousTab
            : prev.focusedTimeInSeconds,
        breakTimeInSeconds:
          currentTab !== "Focus"
            ? prev.breakTimeInSeconds + timeInPreviousTab
            : prev.breakTimeInSeconds,
      }));

      setTotalPausedTime(0);
      setPauseStart(null);
      setIsPaused(false);
      setAmountSecondsPassed(0);
    }

    if (currentTab === "Focus") {
      setCurrentTab(cycleCounter === 4 ? "Long Break" : "Short Break");
    } else {
      setCurrentTab("Focus");
    }
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
  }

  function togglePause() {
    if (isPaused) {
      if (pauseStart) {
        const pauseDuration = differenceInSeconds(new Date(), pauseStart);
        setTotalPausedTime(totalPausedTime + pauseDuration);
      }
    } else {
      setPauseStart(new Date());
    }
    setIsPaused((prev) => !prev);
  }

  function falsePause() {
    setIsPaused(false);
  }

  function createNewCycle(data: CreateCycleData) {
    const now = new Date();
    const newCycle: Cycle = {
      id: String(now.getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: now,
    };

    setStats({
      cyclesCompleted: 0,
      startedAt: now,
      focusedTimeInSeconds: 0,
      breakTimeInSeconds: 0,
    });

    setfocusingOnMessage(data.task);
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
    setTotalPausedTime(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
    setStats((prev) => ({
      ...prev,
      startedAt: null,
    }));
    document.title = "Nova";
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        currentTab,
        isPaused,
        totalPausedTime,
        amountSecondsPassed,
        cycleCounter,
        focusingOnMessage,
        stats,
        markCurrentAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        togglePause,
        falsePause,
        toggleTab,
        increaseCycleCounter,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
