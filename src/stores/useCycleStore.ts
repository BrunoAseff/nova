import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

type CycleStore = {
  // State
  cycles: Cycle[];
  activeCycleId: string | null;
  amountSecondsPassed: number;
  currentTab: string;
  isPaused: boolean;
  focusingOnMessage: string;
  cycleCounter: number;
  completedCycles: number;
  startTime: Date | null;
  focusedTime: number;
  breakTime: number;
  focusedTimeStat: number;
  breakTimeStat: number;
  overallTimeStat: number;
  initialStartTime: Date | null;
  activeCycle: Cycle | undefined;

  // Actions
  markCurrentAsFinished: () => void;
  setSecondsPassed: (updater: (prev: number) => number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
  resetCurrentSession: () => void;
  togglePause: () => void;
  falsePause: () => void;
  toggleTab: () => void;
  increaseCycleCounter: () => void;
  getCurrentSessionTime: () => number;
  setfocusingOnMessage: (message: string) => void;
  skipCurrentSession: () => void;
  updateOverallTimeStat: (seconds: number) => void;
  setFocusedTimeStat: (seconds: number) => void;
  setBreakTimeStat: (seconds: number) => void;
};

export const useCycleStore = create<CycleStore>()(
  devtools((set, get) => ({
    // Initial state
    cycles: [],
    activeCycleId: null,
    amountSecondsPassed: 0,
    currentTab: "Focus",
    isPaused: false,
    focusingOnMessage: "",
    cycleCounter: 0,
    completedCycles: 0,
    startTime: null,
    focusedTime: 0,
    breakTime: 0,
    focusedTimeStat: 0,
    breakTimeStat: 0,
    overallTimeStat: 0,
    initialStartTime: null,
    activeCycle: undefined,

    // Actions
    markCurrentAsFinished: () =>
      set((state): Partial<CycleStore> => {
        const currentCycleIndex = state.cycles.findIndex(
          (cycle) => cycle.id === state.activeCycleId,
        );

        if (currentCycleIndex === -1) return {};

        const updatedCycles = state.cycles.map((cycle) =>
          cycle.id === state.activeCycleId
            ? { ...cycle, finishedDate: new Date() }
            : cycle,
        );

        return {
          cycles: updatedCycles,
          activeCycleId: null,
          focusedTimeStat: 0,
          breakTimeStat: 0,
          initialStartTime: null,
          overallTimeStat: 0,
          cycleCounter: 0,
          currentTab: "Focus",
          amountSecondsPassed: 0,
          activeCycle: undefined,
        };
      }),

    getCurrentSessionTime: () => {
      const { currentTab, activeCycle } = get();
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
    },

    setSecondsPassed: (updater: (prev: number) => number) =>
      set((state) => {
        const totalSeconds = get().getCurrentSessionTime();
        const newSeconds = updater(state.amountSecondsPassed);

        if (newSeconds >= totalSeconds) {
          return {
            amountSecondsPassed: 0,
            currentTab:
              state.currentTab === "Focus"
                ? state.cycleCounter === 3
                  ? "Long Break"
                  : "Short Break"
                : "Focus",
            isPaused: false,
          };
        }

        return {
          amountSecondsPassed: newSeconds,
        };
      }),

    createNewCycle: (data: CreateCycleData) =>
      set((state) => {
        const now = new Date();
        const newCycle: Cycle = {
          id: String(now.getTime()),
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: now,
        };

        const newStartTime = now;
        return {
          cycles: [...state.cycles, newCycle],
          activeCycleId: newCycle.id,
          activeCycle: newCycle,
          startTime: newStartTime,
          initialStartTime: !state.initialStartTime
            ? newStartTime
            : state.initialStartTime,
          focusingOnMessage: data.task,
          amountSecondsPassed: 0,
          focusedTime: 0,
          breakTime: 0,
          focusedTimeStat: 0,
          breakTimeStat: 0,
          overallTimeStat: 0,
          completedCycles: 0,
          cycleCounter: 0,
          currentTab: "Focus",
        };
      }),

    togglePause: () =>
      set(
        (state): Partial<CycleStore> => ({
          isPaused: !state.isPaused,
        }),
      ),

    falsePause: () =>
      set(
        (): Partial<CycleStore> => ({
          isPaused: false,
        }),
      ),
    toggleTab: () =>
      set((state) => {
        if (!state.activeCycle) return state;

        if (state.currentTab === "Focus") {
          const updatedFocusedTime =
            state.focusedTime + state.amountSecondsPassed;
          const updatedFocusedTimeStat =
            state.focusedTimeStat + state.amountSecondsPassed;
          const newCycleCounter =
            state.cycleCounter === 3 ? 0 : state.cycleCounter + 1;
          const newCompletedCycles =
            state.cycleCounter === 3
              ? state.completedCycles + 1
              : state.completedCycles;

          return {
            focusedTime: updatedFocusedTime,
            focusedTimeStat: updatedFocusedTimeStat,
            cycleCounter: newCycleCounter,
            completedCycles: newCompletedCycles,
            currentTab: newCycleCounter === 0 ? "Long Break" : "Short Break",
            amountSecondsPassed: 0,
            isPaused: false,
          };
        }

        return {
          breakTime: state.breakTime + state.amountSecondsPassed,
          breakTimeStat: state.breakTimeStat + state.amountSecondsPassed,
          currentTab: "Focus",
          amountSecondsPassed: 0,
          isPaused: false,
        };
      }),

    increaseCycleCounter: () =>
      set((state) => {
        const newCycleCounter =
          state.cycleCounter === 3 ? 0 : state.cycleCounter + 1;
        return {
          cycleCounter: newCycleCounter,
          completedCycles:
            state.cycleCounter === 3
              ? state.completedCycles + 1
              : state.completedCycles,
        };
      }),

    setfocusingOnMessage: (message: string) =>
      set(
        (): Partial<CycleStore> => ({
          focusingOnMessage: message,
        }),
      ),

    updateOverallTimeStat: (seconds: number) =>
      set(
        (): Partial<CycleStore> => ({
          overallTimeStat: seconds,
        }),
      ),

    setFocusedTimeStat: (seconds: number) =>
      set(
        (): Partial<CycleStore> => ({
          focusedTimeStat: seconds,
        }),
      ),

    resetCurrentSession: () =>
      set((state) => ({
        amountSecondsPassed: 0,
        isPaused: false,
        initialStartTime:
          state.startTime && !state.initialStartTime
            ? state.startTime
            : state.initialStartTime,
        startTime: new Date(),
      })),
    interruptCurrentCycle: () =>
      set((state) => {
        const updatedCycles = state.cycles.map((cycle) =>
          cycle.id === state.activeCycleId
            ? { ...cycle, interruptedDate: new Date() }
            : cycle,
        );
        
        document.title = "Nova";

        return {
          cycles: updatedCycles,
          initialStartTime: null,
          focusedTimeStat: 0,
          breakTimeStat: 0,
          overallTimeStat: 0,
          activeCycleId: null,
          activeCycle: undefined,
          cycleCounter: 0,
          currentTab: "Focus",
          startTime: null,
          amountSecondsPassed: 0,
        };
      }),
    skipCurrentSession: () =>
      set((state) => {
        if (state.currentTab === "Focus") {
          const newCycleCounter =
            state.cycleCounter === 3 ? 0 : state.cycleCounter + 1;
          const newCompletedCycles =
            state.cycleCounter === 3
              ? state.completedCycles + 1
              : state.completedCycles;

          return {
            amountSecondsPassed: 0,
            isPaused: false,
            cycleCounter: newCycleCounter,
            completedCycles: newCompletedCycles,
            currentTab: newCycleCounter === 0 ? "Long Break" : "Short Break",
          };
        }

        return {
          amountSecondsPassed: 0,
          isPaused: false,
          currentTab: "Focus",
        };
      }),

    setBreakTimeStat: (seconds: number) =>
      set(
        (): Partial<CycleStore> => ({
          breakTimeStat: seconds,
        }),
      ),
  })),
);
