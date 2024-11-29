import type { Space } from "@/types";

export function updateLocalStorage(spaces: Space[]) {
  const spacesToStore = spaces.map((space) => ({
    ...space,
    icon: space.name,
  }));
  localStorage.setItem("spaces", JSON.stringify(spacesToStore));
}
