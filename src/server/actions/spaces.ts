import { initialState } from "@/contexts/initialState";
import type { Space } from "@/types";

export const fetchSpacesData = async (): Promise<Space[]> => {
  const fetchBackendSpaces = async () => {
    return null;
  };
  try {
    const backendData = await fetchBackendSpaces(); // Placeholder function for backend API call.
    if (backendData) return backendData;

    const localData = localStorage.getItem("spaces");
    if (localData) {
      const parsedData = JSON.parse(localData);
      return parsedData.map((space: any) => ({
        ...initialState.spaces.find((s) => s.name === space.name),
        ...space,
        icon: initialState.spaces.find((s) => s.name === space.name)?.icon,
      }));
    }

    return initialState.spaces;
  } catch (error) {
    console.error("Error fetching spaces data:", error);
    return initialState.spaces;
  }
};
