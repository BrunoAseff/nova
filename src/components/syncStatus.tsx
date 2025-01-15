"use client";

import { CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAutoSaveContext } from "./autoSaveProvider";

export function SyncStatus() {
  const { syncStatus } = useAutoSaveContext();

  return (
    <div
      className={cn(
        "fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur transition-opacity",
        syncStatus === "idle" && "opacity-0",
      )}
    >
      {syncStatus === "saving" && (
        <>
          <CircleNotch className="animate-spin" size={16} />
          <span>Saving changes...</span>
        </>
      )}
      {syncStatus === "saved" && (
        <>
          <CheckCircle className="text-green-500" size={16} />
          <span>Saved!</span>
        </>
      )}
      {syncStatus === "error" && (
        <>
          <XCircle className="text-red-500" size={16} />
          <span>Couldn&apos;t save changes</span>
        </>
      )}
    </div>
  );
}
