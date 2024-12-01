import { initialState } from "@/contexts/initialState";

export const fetchSpacesData = async () => {
  const fetchBackendSpaces = async () => {
    return null;
  };

  try {
    const backendData = await fetchBackendSpaces(); // Placeholder function for backend API call.
    if (backendData) return backendData;

    // Fetch spaces from local storage
    const localSpacesData = localStorage.getItem("spaces");
    const localShortcut =
      localStorage.getItem("shortcut") ?? initialState.shortcut;
    const localAmbientSound =
      localStorage.getItem("ambientSound") ?? initialState.ambientSound;
    const localAmbientSoundVolume = localStorage.getItem("ambientSoundVolume")
      ? parseInt(localStorage.getItem("ambientSoundVolume")!)
      : initialState.ambientSoundVolume;

    if (localSpacesData) {
      const parsedSpacesData = JSON.parse(localSpacesData);
      const reconstructedSpaces = parsedSpacesData.map((space: any) => ({
        ...initialState.spaces.find((s) => s.name === space.name),
        ...space,
        icon: initialState.spaces.find((s) => s.name === space.name)?.icon,
      }));

      return {
        spaces: reconstructedSpaces,
        shortcut: localShortcut,
        ambientSound: localAmbientSound,
        ambientSoundVolume: localAmbientSoundVolume,
      };
    }

    return {
      spaces: initialState.spaces,
      shortcut: initialState.shortcut,
      ambientSound: initialState.ambientSound,
      ambientSoundVolume: initialState.ambientSoundVolume,
    };
  } catch (error) {
    console.error("Error fetching spaces data:", error);
    return {
      spaces: initialState.spaces,
      shortcut: initialState.shortcut,
      ambientSound: initialState.ambientSound,
      ambientSoundVolume: initialState.ambientSoundVolume,
    };
  }
};
