import { createContext, useContext, useState } from "react";
import { Space } from "../types";

const initialState: { spaces: Space[] } = {
  spaces: [
    { 
      name: "Home", 
      clock: { isHidden: false, position: "center", timeFormat: "12h" },
      background: "/home.jpg",
    },
    { 
      name: "Focus", 
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      background: "/focus.jpg",
    }
  ]
};

const SpacesContext = createContext({
  state: initialState,
  setState: (state: typeof initialState) => {}
});

export const SpacesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(initialState);

return (
  <SpacesContext.Provider value={{ state, setState }}>
    {children}
  </SpacesContext.Provider>
);
  
};

// Custom hook to use the context
export const useSpacesContext = () => useContext(SpacesContext);
