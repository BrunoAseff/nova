import { useEffect, useState } from "react";
import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";

export function useClockSettings() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedPosition, setSelectedPosition] = useState<Position>("center");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h");
  const [isClockVisible, setIsClockVisible] = useState(true);

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.id === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.clock.position);
      setTimeFormat(selectedSpace.clock.timeFormat);
      setIsClockVisible(!selectedSpace.clock.isHidden);
    }
  }, [spaces, selectedTab]);

  const updateClockProperty = (key: string, value: any) => {
    const clock = spaces.find((s) => s.id === selectedTab)?.clock;
    if (clock) {
      updateSpaceProperty(selectedTab, "clock", {
        ...clock,
        [key]: value,
      });
    }
  };

  return {
    selectedPosition,
    setSelectedPosition,
    timeFormat,
    setTimeFormat,
    isClockVisible,
    setIsClockVisible,
    updateClockProperty,
  };
}
