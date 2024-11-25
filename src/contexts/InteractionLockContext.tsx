/* eslint-disable @typescript-eslint/no-empty-function */

import React, { createContext, useContext, useState, useRef } from "react";

const SidebarContext = createContext<{
  isSelectOpen: boolean;
  setSelectOpen: (isOpen: boolean) => void;
  lastSelectCloseTime: React.MutableRefObject<number>;
}>({
  isSelectOpen: false,
  setSelectOpen: () => {},
  lastSelectCloseTime: { current: 0 },
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSelectOpen, setSelectOpen] = useState(false);
  const lastSelectCloseTime = useRef(0);

  return (
    <SidebarContext.Provider
      value={{ isSelectOpen, setSelectOpen, lastSelectCloseTime }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useInteractionLock = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useInteractionLock must be used within a SidebarProvider");
  }
  return context;
};
