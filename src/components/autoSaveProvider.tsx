import type { Change } from "@/types/changes";
import { useAutoSave } from "@/utils/useAutoSave";
import { createContext, useContext } from "react";

type AutoSaveContextType = {
  addChange: (change: Omit<Change, "id" | "timestamp">) => void;
  forceSyncNow: () => Promise<void>;
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
  const { addChange, forceSyncNow } = useAutoSave(userId);

  if (!userId) {
    return <>{children}</>;
  }

  return (
    <AutoSaveContext.Provider value={{ addChange, forceSyncNow }}>
      {children}
    </AutoSaveContext.Provider>
  );
}
