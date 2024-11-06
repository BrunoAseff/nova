import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";

export default function ClockTab() {
  const [selectedPosition, setSelectedPosition] = useState("center");
  const [timeFormat, setTimeFormat] = useState("24h");

  return (
    <main className="flex flex-col gap-10">
      <div className="flex min-h-10 w-[90%] items-center justify-between space-x-2 rounded-2xl border-[1px] border-accent p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="clock-visibity" className="text-md text-foreground">
            Visibility
          </Label>
          <p className="text-sm text-muted-foreground">
            Controls if the clock is visible on the screen.
          </p>
        </div>
        <Switch id="clock-visibity" />
      </div>

      <div className="ml-3 flex flex-col gap-4">
        <Label htmlFor="clock-visibity" className="text-md text-foreground">
          Position
        </Label>
        <RadioGroup
          className="flex w-[90%] justify-evenly gap-2"
          orientation="horizontal"
          value={selectedPosition}
          onValueChange={setSelectedPosition}
        >
          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": selectedPosition === "top-right",
                "hover:bg-accent-foreground": selectedPosition !== "top-right",
              },
            )}
            onClick={() => setSelectedPosition("top-right")}
          >
            <Label
              htmlFor="r4"
              className={clsx({
                "text-secondary": selectedPosition === "top-right",
              })}
            >
              Top right
            </Label>
            <RadioGroupItem value="top-right" id="r4" />
          </div>

          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": selectedPosition === "top-left",
                "hover:bg-accent-foreground": selectedPosition !== "top-left",
              },
            )}
            onClick={() => setSelectedPosition("top-left")}
          >
            <Label
              htmlFor="r4"
              className={clsx({
                "text-secondary": selectedPosition === "top-left",
              })}
            >
              Top Left
            </Label>
            <RadioGroupItem value="top-left" id="r4" />
          </div>
          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": selectedPosition === "bottom-left",
                "hover:bg-accent-foreground":
                  selectedPosition !== "bottom-left",
              },
            )}
            onClick={() => setSelectedPosition("bottom-left")}
          >
            <Label
              htmlFor="r4"
              className={clsx({
                "text-secondary": selectedPosition === "bottom-left",
              })}
            >
              Bottom Left
            </Label>
            <RadioGroupItem value="bottom-left" id="r4" />
          </div>
          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": selectedPosition === "center",
                "hover:bg-accent-foreground": selectedPosition !== "center",
              },
            )}
            onClick={() => setSelectedPosition("center")}
          >
            <Label
              htmlFor="r4"
              className={clsx({
                "text-secondary": selectedPosition === "center",
              })}
            >
              Center
            </Label>
            <RadioGroupItem value="center" id="r4" />
          </div>
        </RadioGroup>
      </div>
      <div className="ml-3 flex flex-col gap-4">
        <Label htmlFor="time-format" className="text-md text-foreground">
          Time Format
        </Label>
        <RadioGroup
          className="flex w-[90%] justify-center gap-4"
          orientation="horizontal"
          value={timeFormat}
          onValueChange={setTimeFormat}
        >
          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": timeFormat === "24h",
                "hover:bg-accent-foreground": timeFormat !== "24h",
              },
            )}
            onClick={() => setTimeFormat("24h")}
          >
            <Label
              htmlFor="r5"
              className={clsx({
                "text-secondary": timeFormat === "24h",
              })}
            >
              24h
            </Label>
            <RadioGroupItem value="24h" id="r5" />
          </div>
          <div
            className={clsx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 space-x-2 rounded-xl border-[1px] border-accent px-6 py-4",
              {
                "bg-muted": timeFormat === "12h",
                "hover:bg-accent-foreground": timeFormat !== "12h",
              },
            )}
            onClick={() => setTimeFormat("12h")}
          >
            <Label
              htmlFor="r5"
              className={clsx({
                "text-secondary": timeFormat === "12h",
              })}
            >
              12h
            </Label>
            <RadioGroupItem value="12h" id="r5" />
          </div>
        </RadioGroup>
      </div>
    </main>
  );
}
