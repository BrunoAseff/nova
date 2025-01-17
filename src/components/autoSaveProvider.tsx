/* eslint-disable @typescript-eslint/no-empty-function */
import type { Change } from "@/types/changes";
import { useAutoSave } from "@/utils/useAutoSave";
import { createContext, useContext } from "react";

export type SyncStatus = "idle" | "saving" | "saved" | "error";

type AutoSaveContextType = {
  addChange: (change: Omit<Change, "id" | "timestamp">) => void;
  forceSyncNow: () => Promise<void>;
  syncStatus: SyncStatus;
};

const AutoSaveContext = createContext<AutoSaveContextType | null>(null);

export function useAutoSaveContext() {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error(
      "useAutoSaveContext must be used within an AutoSaveProvider",
    );
  }
  return context;
}

type Props = {
  children: React.ReactNode;
  userId?: string;
};

export function AutoSaveProvider({ children, userId }: Props) {
  const { addChange, forceSyncNow, syncStatus } = useAutoSave(userId ?? "");

  return (
    <AutoSaveContext.Provider
      value={
        userId
          ? { addChange, forceSyncNow, syncStatus }
          : {
              addChange: () => {},
              forceSyncNow: async () => {},
              syncStatus: "idle" as const,
            }
      }
    >
      {children}
    </AutoSaveContext.Provider>
  );
}
