import { useSpacesContext } from "@/contexts/spaceContext";
import type { Position } from "@/types";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";

export default function ClockShortcut() {
  const { spaces, selectedTab, updateSpaceProperty } = useSpacesContext();
  const [selectedPosition, setSelectedPosition] = useState<Position>("center");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h");

  useEffect(() => {
    const selectedSpace = spaces.find((space) => space.name === selectedTab);
    if (selectedSpace) {
      setSelectedPosition(selectedSpace.clock.position);
      setTimeFormat(selectedSpace.clock.timeFormat);
    }
  }, [spaces, selectedTab]);

  const handleClockPositionChange = (position: Position) => {
    setSelectedPosition(position);
    updateSpaceProperty(selectedTab, "clock", {
      ...spaces.find((s) => s.name === selectedTab)?.clock,
      position,
    });
  };

  const handleTimeFormatChange = (format: "12h" | "24h") => {
    setTimeFormat(format);
    updateSpaceProperty(selectedTab, "clock", {
      ...spaces.find((s) => s.name === selectedTab)?.clock,
      timeFormat: format,
    });
  };

  return (
    <main className="h-fit">
      <h1 className="mb-2 font-delius text-xl text-secondary-foreground/80">
        <span className="text-secondary">Clock</span> settings
      </h1>
      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 py-2">
          <div className="flex w-full flex-col gap-4">
            <Label htmlFor="clock-position" className="text-sm text-foreground">
              Position
            </Label>
            <RadioGroup
              className="grid w-full cursor-pointer grid-cols-2 items-center justify-evenly gap-4 text-center"
              orientation="horizontal"
              value={selectedPosition}
              onValueChange={handleClockPositionChange}
            >
              {["top-right", "top-left", "bottom-left", "center"].map((pos) => (
                <div
                  key={pos}
                  className={clsx(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent bg-accent-foreground px-4 py-3 text-xs",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        selectedPosition === pos,
                      "hover:bg-background": selectedPosition !== pos,
                    },
                  )}
                  onClick={() => handleClockPositionChange(pos as Position)}
                >
                  <Label
                    htmlFor={`pos-${pos}`}
                    className={clsx({
                      "text-secondary": selectedPosition === pos,
                    })}
                  >
                    {pos.charAt(0).toUpperCase() +
                      pos.slice(1).replace("-", " ")}
                  </Label>
                  <RadioGroupItem
                    aria-label={`Select ${pos} position`}
                    value={pos}
                    id={`pos-${pos}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="ml-auto flex w-full space-x-2 rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="time-format" className="text-sm text-foreground">
              Time Format
            </Label>
            <RadioGroup
              className="grid w-full cursor-pointer grid-cols-2 items-center justify-evenly gap-4 text-center"
              orientation="horizontal"
              value={timeFormat}
              onValueChange={handleTimeFormatChange}
            >
              {["24h", "12h"].map((format) => (
                <div
                  key={format}
                  className={clsx(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent bg-accent-foreground px-6 py-3 text-xs",
                    {
                      "border-secondary bg-secondary-smooth-700/10":
                        timeFormat === format,
                      "hover:bg-background": timeFormat !== format,
                    },
                  )}
                  onClick={() =>
                    handleTimeFormatChange(format as "12h" | "24h")
                  }
                >
                  <Label
                    htmlFor={`format-${format}`}
                    className={clsx({
                      "text-secondary": timeFormat === format,
                    })}
                  >
                    {format}
                  </Label>
                  <RadioGroupItem
                    aria-label={`Choose ${format} format`}
                    value={format}
                    id={`format-${format}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
