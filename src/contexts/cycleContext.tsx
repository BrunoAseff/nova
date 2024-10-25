"use client";
import { createContext, useReducer, useState } from "react";
import type { ReactNode } from "react";
import type { Cycle } from "@/reducers/cycles/cycleReducer";
import { cyclesReducer } from "@/reducers/cycles/cycleReducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "@/reducers/cycles/cycleActions";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Array<Cycle>;
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentAsFinished: () => void;
  setSecondsPassed: (updater: (prev: number) => number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  resetCurrentSession: () => void; // New function
  isPaused: boolean;
  togglePause: () => void;
  falsePause: () => void;
  focusingOnMessage: string;
  currentTab: string;
  toggleTab: () => void;
  increaseCycleCounter: () => void;
  cycleCounter: number;
  completedCycles: number;
  startTime: Date | null;
  focusedTime: number;
  breakTime: number;
  getCurrentSessionTime: () => number;
  setfocusingOnMessage: (message: string) => void;
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
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const [focusingOnMessage, setfocusingOnMessage] = useState("");
  const [cycleCounter, setCycleCounter] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [focusedTime, setFocusedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function getCurrentSessionTime() {
    switch (currentTab) {
      case "Focus":
        return (activeCycle?.minutesAmount ?? 25) * 60;
      case "Long Break":
        return 15 * 60;
      case "Short Break":
        return 5 * 60;
      default:
        return 25 * 60;
    }
  }

  function increaseCycleCounter() {
    if (cycleCounter === 4) {
      setCycleCounter(0);
      setCompletedCycles((prev) => prev + 1);
    } else {
      setCycleCounter((prev) => prev + 1);
    }
  }

  function toggleTab() {
    if (activeCycle) {
      // Store the time spent in the current session
      if (currentTab === "Focus") {
        setFocusedTime((prev) => prev + amountSecondsPassed);
        increaseCycleCounter();
        setCurrentTab(cycleCounter === 4 ? "Long Break" : "Short Break");
      } else {
        setBreakTime((prev) => prev + amountSecondsPassed);
        setCurrentTab("Focus");
      }

      // Reset seconds for new session
      setAmountSecondsPassed(0);
      setIsPaused(false);
    }
  }

  function setSecondsPassed(updater: (prev: number) => number) {
    const totalSeconds = getCurrentSessionTime();
    const newSeconds = updater(amountSecondsPassed);

    if (newSeconds >= totalSeconds) {
      toggleTab();
      setAmountSecondsPassed(0);
    } else {
      setAmountSecondsPassed(newSeconds);
    }
  }

  function resetCurrentSession() {
    // Reset only the current session timer while maintaining all other state
    setAmountSecondsPassed(0);
    setIsPaused(false);
    // Update startTime for the current session only
    setStartTime(new Date());
  }

  function markCurrentAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
    setAmountSecondsPassed(0);
  }

  function togglePause() {
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

    setStartTime(now);
    setfocusingOnMessage(data.task);
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
    setFocusedTime(0);
    setBreakTime(0);
    setCompletedCycles(0);
    setCycleCounter(0);
    setCurrentTab("Focus");
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
    setStartTime(null);
    setAmountSecondsPassed(0);
    document.title = "Nova";
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        resetCurrentSession, // Added to context
        isPaused,
        togglePause,
        falsePause,
        focusingOnMessage,
        toggleTab,
        currentTab,
        cycleCounter,
        increaseCycleCounter,
        completedCycles,
        startTime,
        focusedTime,
        breakTime,
        getCurrentSessionTime,
        setfocusingOnMessage,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
