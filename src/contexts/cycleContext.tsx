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

interface CyclesContextType {
  cycles: Array<Cycle>;
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  isPaused: boolean;
  togglePause: () => void;
  falsePause: () => void;
  totalPausedTime: number;
  focusingOnMessage: string;
  currentTab: string;
  toggleTab: () => void;
  increaseCycleCounter: () => void;
  cycleCounter: number;
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
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [cycleCounter, setCycleCounter] = useState(0);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  function increaseCycleCounter() {
    if (cycleCounter === 3) {
      setCycleCounter(0);
    } else {
      setCycleCounter((prev) => prev + 1);
    }
  }

  function toggleTab() {
    if (activeCycle) {
      const updatedCycle = { ...activeCycle, startDate: new Date() };

      dispatch(updateCycleStartDateAction(updatedCycle));

      const secondsElapsed =
        differenceInSeconds(new Date(), new Date(updatedCycle.startDate)) -
        totalPausedTime;
      setAmountSecondsPassed(secondsElapsed);
    }

    if (currentTab === "Focus") {
      setCurrentTab(cycleCounter === 3 ? "Long Break" : "Short Break");
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
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setfocusingOnMessage(data.task);
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
    setTotalPausedTime(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
    setCycleCounter(0);
    setCurrentTab("Focus");
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
        isPaused,
        togglePause,
        falsePause,
        totalPausedTime,
        focusingOnMessage,
        toggleTab,
        currentTab,
        cycleCounter,
        increaseCycleCounter,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
