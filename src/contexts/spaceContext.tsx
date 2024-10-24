"use client";
import { createContext, useContext, useState } from "react";
import type { Space } from "../types";
import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";

const initialState: { spaces: Space[] } = {
  spaces: [
    {
      name: "Home",
      icon: <Home color="currentColor" />,
      clock: { isHidden: false, position: "center", timeFormat: "24h" },
      pomodoro: { isHidden: true },
      background: "/home1.jpg",
    },
    {
      name: "Focus",
      icon: <Focus color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: { isHidden: false },
      background: "/focus.jpg",
    },
    {
      name: "Relax",
      icon: <Relax color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: { isHidden: true },
      background: "/relax.jpg",
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
