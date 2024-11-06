"use client";
import { createContext, useContext, useState } from "react";
import type { Space } from "../types";
import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";

export interface SpaceContextValue {
  spaces: Space[];
  selectedTab: string;
  selectTab: (tab: string) => void;
  updateSpaceProperty: (
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) => void;
  updateSpaceSharedProperty: (propertyName: "isHidden", value: boolean) => void;
}

const initialState: SpaceContextValue = {
  spaces: [
    {
      name: "Home",
      icon: <Home color="currentColor" />,
      clock: { isHidden: false, position: "center", timeFormat: "24h" },
      pomodoro: { isHidden: true },
      timer: { isHidden: true },
      quote: { position: "bottom-left", isHidden: false },
      background: "/backgrounds/home.webp",
    },
    {
      name: "Focus",
      icon: <Focus color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: { isHidden: false },
      timer: { isHidden: true },
      quote: { position: "bottom-left", isHidden: true },
      background: "/backgrounds/focus.webp",
    },
    {
      name: "Relax",
      icon: <Relax color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: { isHidden: true },
      timer: { isHidden: true },
      quote: { position: "top-right", isHidden: false },
      background: "/backgrounds/relax.webp",
    },
  ],
  selectedTab: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectTab: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateSpaceProperty: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateSpaceSharedProperty: () => {},
};

const SpacesContext = createContext<SpaceContextValue>(initialState);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState("");
  const [spaces, setSpaces] = useState<Space[]>(initialState.spaces);

  function selectTab(tab: string) {
    setSelectedTab(tab);
  }

  function updateSpaceProperty(
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.name === spaceName ? { ...space, [propertyName]: value } : space,
      ),
    );
  }

  function updateSpaceSharedProperty(propertyName: "isHidden", value: boolean) {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => ({
        ...space,
        [propertyName]: value,
      })),
    );
  }

  const value: SpaceContextValue = {
    spaces,
    selectedTab,
    selectTab,
    updateSpaceProperty,
    updateSpaceSharedProperty,
  };

  return (
    <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
