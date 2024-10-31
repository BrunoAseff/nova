"use client";
import { createContext, useReducer, useState, useEffect } from "react";
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
  skipCurrentSession: () => void;
  focusedTimeStat: number;
  breakTimeStat: number;
  overallTimeStat: number;
  updateOverallTimeStat: (seconds: number) => void;
  initialStartTime: Date | null;
  setFocusedTimeStat: (seconds: number) => void;
  setBreakTimeStat: (seconds: number) => void;
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
  const [focusedTimeStat, setFocusedTimeStat] = useState(0);
  const [breakTimeStat, setBreakTimeStat] = useState(0);
  const [overallTimeStat, setOverallTimeStat] = useState(0);
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null); // New state for initial start time

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    if (startTime && !initialStartTime) {
      setInitialStartTime(startTime);
    }
  }, [startTime, initialStartTime]);

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
    setCycleCounter((prev) => prev + 1);

    if (cycleCounter === 3) {
      setCycleCounter(0);
      setCompletedCycles((prev) => prev + 1);
    }
  }

  function toggleTab() {
    if (activeCycle) {
      if (currentTab === "Focus") {
        setFocusedTime((prev) => prev + amountSecondsPassed);
        setFocusedTimeStat((prev) => prev + amountSecondsPassed);

        increaseCycleCounter();

        setCurrentTab(cycleCounter === 3 ? "Long Break" : "Short Break");
      } else {
        setBreakTime((prev) => prev + amountSecondsPassed);
        setBreakTimeStat((prev) => prev + amountSecondsPassed);
        setCurrentTab("Focus");
      }
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
    setAmountSecondsPassed(0);
    setIsPaused(false);

    if (!initialStartTime) {
      setInitialStartTime(new Date());
    }
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

    // Reset both original and stat variables
    setFocusedTime(0);
    setBreakTime(0);
    setFocusedTimeStat(0);
    setBreakTimeStat(0);
    setOverallTimeStat(0);

    setCompletedCycles(0);
    setCycleCounter(0);
    setCurrentTab("Focus");
  }

  function updateOverallTimeStat(seconds: number) {
    setOverallTimeStat(seconds);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
    setStartTime(null);
    setAmountSecondsPassed(0);
    document.title = "Nova";
  }

  function skipCurrentSession() {
    setAmountSecondsPassed(0);
    setIsPaused(false);
    toggleTab();
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
        skipCurrentSession,
        focusedTimeStat,
        breakTimeStat,
        overallTimeStat,
        updateOverallTimeStat,
        initialStartTime,
        setFocusedTimeStat,
        setBreakTimeStat,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
