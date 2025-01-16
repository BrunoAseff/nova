import { useEffect, useRef, useCallback, useState } from "react";
import { getChanges, removeChange } from "@/utils/localStorageChanges";
import type { Change } from "@/types/changes";
import type { SyncStatus } from "@/components/autoSaveProvider";

const SYNC_INTERVAL = 10000;

export function useAutoSave(userId?: string) {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  const addChange = useCallback(
    (change: Omit<Change, "id" | "timestamp">) => {
      if (!userId) return;

      const newChange: Change = {
        ...change,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      const changes = getChanges();

      changes.pending = changes.pending.filter(
        (existingChange) =>
          !(
            existingChange.type === change.type &&
            existingChange.spaceId === change.spaceId &&
            existingChange.property === change.property
          ),
      );

      changes.pending.push(newChange);
      localStorage.setItem("nova-changes", JSON.stringify(changes));
    },
    [userId],
  );

  const syncChanges = useCallback(async () => {
    if (!userId) return;

    const changes = getChanges();
    if (changes.pending.length === 0) {
      setSyncStatus("idle");
      return;
    }

    try {
      setSyncStatus("saving");
      const payload = { changes: changes.pending };

      const response = await fetch("/api/settings/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        setSyncStatus("error");
        throw new Error(`Sync failed: ${errorText}`);
      }

      const { processedChangeIds } = await response.json();
      processedChangeIds.forEach(removeChange);
      setSyncStatus("saved");

      // Reset to idle after a delay
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (error) {
      setSyncStatus("error");
      console.error("Error syncing changes:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const startSync = () => {
      syncChanges();
      syncTimeoutRef.current = setTimeout(startSync, SYNC_INTERVAL);
    };

    startSync();

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [userId, syncChanges]);

  const forceSyncNow = useCallback(() => {
    if (!userId) return Promise.resolve();
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    return syncChanges();
  }, [userId, syncChanges]);

  return { addChange, forceSyncNow, syncStatus };
}
