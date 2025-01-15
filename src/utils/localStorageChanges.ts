import type { Change, ChangeAction, Changes } from "@/types/changes";

const CHANGES_STORAGE_KEY = "nova-changes";

export function getChanges(): Changes {
  try {
    const storedChanges = localStorage.getItem(CHANGES_STORAGE_KEY);
    return storedChanges
      ? JSON.parse(storedChanges)
      : { pending: [], failed: [] };
  } catch {
    return { pending: [], failed: [] };
  }
}

function addChange(change: Omit<Change, "id" | "timestamp">) {
  const changes = getChanges();
  const newChange: Change = {
    ...change,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  changes.pending = changes.pending.filter(
    (existingChange) =>
      !(
        existingChange.type === change.type &&
        existingChange.spaceId === change.spaceId &&
        existingChange.property === change.property
      ),
  );

  changes.pending.push(newChange);
  localStorage.setItem(CHANGES_STORAGE_KEY, JSON.stringify(changes));
}

export function updateSpaceLocalStorageChanges(
  spaceId: number,
  property: string,
  value: unknown,
) {
  addChange({
    type: "space",
    action: "update",
    spaceId,
    property,
    value,
  });
}

export function updateReminderLocalStorageChanges(
  action: ChangeAction,
  value: unknown,
) {
  addChange({
    type: "reminder",
    action,
    value,
  });
}

export function updateShortcutLocalStorageChanges(shortcut: string) {
  addChange({
    type: "shortcut",
    action: "update",
    value: shortcut,
  });
}

export function updateAmbientSoundLocalStorageChanges(soundUrl: string) {
  addChange({
    type: "ambientSound",
    action: "update",
    value: soundUrl,
  });
}

export function removeChange(changeId: string) {
  const changes = getChanges();
  changes.pending = changes.pending.filter((change) => change.id !== changeId);
  localStorage.setItem(CHANGES_STORAGE_KEY, JSON.stringify(changes));
}
