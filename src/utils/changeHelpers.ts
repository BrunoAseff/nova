import type { Change, Changes } from "@/types/changes";

const CHANGES_STORAGE_KEY = "nova-changes";

export function getChanges(): Changes {
  try {
    const storedChanges = localStorage.getItem(CHANGES_STORAGE_KEY);
    return storedChanges
      ? JSON.parse(storedChanges)
      : { pending: [], failed: [] };
  } catch (error) {
    console.error("Error reading changes from localStorage:", error);
    return { pending: [], failed: [] };
  }
}

export function addChange(change: Omit<Change, "id" | "timestamp">) {
  try {
    const changes = getChanges();
    const newChange: Change = {
      ...change,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    // Check for existing similar changes and remove them
    changes.pending = changes.pending.filter(
      (existingChange) =>
        !(
          existingChange.type === change.type &&
          existingChange.spaceId === change.spaceId &&
          JSON.stringify(existingChange.path) === JSON.stringify(change.path)
        ),
    );

    changes.pending.push(newChange);
    localStorage.setItem(CHANGES_STORAGE_KEY, JSON.stringify(changes));
  } catch (error) {
    console.error("Error adding change to localStorage:", error);
  }
}

export function removeChange(changeId: string) {
  try {
    const changes = getChanges();
    changes.pending = changes.pending.filter(
      (change) => change.id !== changeId,
    );
    localStorage.setItem(CHANGES_STORAGE_KEY, JSON.stringify(changes));
  } catch (error) {
    console.error("Error removing change from localStorage:", error);
  }
}

export function markChangeFailed(changeId: string) {
  try {
    const changes = getChanges();
    const failedChange = changes.pending.find(
      (change) => change.id === changeId,
    );

    if (failedChange) {
      changes.pending = changes.pending.filter(
        (change) => change.id !== changeId,
      );
      changes.failed.push(failedChange);
      localStorage.setItem(CHANGES_STORAGE_KEY, JSON.stringify(changes));
    }
  } catch (error) {
    console.error("Error marking change as failed:", error);
  }
}
