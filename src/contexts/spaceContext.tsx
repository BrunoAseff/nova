"use client";
import { createContext, useContext, useState } from "react";
import type { Space } from "../types";

const initialState: { spaces: Space[] } = {
  spaces: [
    {
      name: "Home",
      clock: { isHidden: false, position: "center", timeFormat: "12h" },
      background: "/home1.jpg",
    },
    {
      name: "Focus",
      clock: { isHidden: false, position: "top-right", timeFormat: "12h" },
      background: "/home.jpg",
    },
  ],
};

const SpacesContext = createContext({
  state: initialState,
});

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [state] = useState(initialState);

  return (
    <SpacesContext.Provider value={{ state }}>
      {children}
    </SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
