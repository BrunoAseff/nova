export async function updateSpace(
  spaceId: number,
  property: string,
  value: unknown,
): Promise<void> {
  const response = await fetch("/api/settings/space", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spaceId, property, value }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update space");
  }
}

export async function updateAmbientSound(ambientSound: string): Promise<void> {
  const response = await fetch("/api/settings/ambient-sound", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ambientSound }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update ambient sound");
  }
}

export async function updateShortcut(shortcut: string): Promise<void> {
  const response = await fetch("/api/settings/shortcut", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shortcut }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update shortcut");
  }
}

export async function createReminder(
  id: string,
  text: string,
  type: string,
): Promise<void> {
  const response = await fetch("/api/settings/reminder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, text, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create reminder");
  }
}

export async function updateReminder(
  id: string,
  text?: string,
  type?: string,
): Promise<void> {
  const response = await fetch("/api/settings/reminder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, text, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update reminder");
  }
}

export async function deleteReminder(id: string): Promise<void> {
  const response = await fetch(`/api/settings/reminder?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete reminder");
  }
}
