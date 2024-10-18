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
  totalPausedTime: number; // New state to track the total pause time
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

  const [isPaused, setIsPaused] = useState(false);
  const [pauseStart, setPauseStart] = useState<Date | null>(null); // Track when the cycle was paused
  const [totalPausedTime, setTotalPausedTime] = useState(0); // Track the total time paused

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function togglePause() {
    if (isPaused) {
      // When unpausing, calculate the total pause time
      if (pauseStart) {
        const pauseDuration = differenceInSeconds(new Date(), pauseStart);
        setTotalPausedTime(totalPausedTime + pauseDuration);
      }
    } else {
      // When pausing, record the start time of the pause
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

    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
    setTotalPausedTime(0); // Reset the total paused time for the new cycle
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
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
        totalPausedTime, // Provide totalPausedTime in the context
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
