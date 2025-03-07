"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import type { ClockProps } from "@/types";
import { ClockIcon } from "../icons/Clock";

export default function Clock(props: ClockProps) {
  const { timeFormat, position, isHidden = false } = props;
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timeMessage, setTimeMessage] = useState<string>("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime =
        timeFormat === "12h" ? format(now, "hh:mm") : format(now, "HH:mm");
      setCurrentTime(formattedTime);

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setTimeMessage("Morning");
      } else if (hour >= 12 && hour < 17) {
        setTimeMessage("Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setTimeMessage("Evening");
      } else {
        setTimeMessage("Night");
      }
    };

    updateCurrentTime();

    const interval = setInterval(() => {
      updateCurrentTime();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [timeFormat]);

  const positionClass = (): string => {
    switch (position) {
      case "top-left":
        return "top-0 left-0 m-2 md:m-10";
      case "top-right":
        return "top-0 right-0 m-2 md:m-10";
      case "bottom-left":
        return "bottom-0 left-0 m-2 md:m-10";
      case "center":
        return "top-1/2 scale-150 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      default:
        return "";
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClass()} flex items-center justify-center`}
    >
      <div className="relative flex h-28 w-48 rounded-3xl bg-transparent p-1 font-montserrat md:h-36 md:w-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-medium tabular-nums text-white md:text-5xl">
            {currentTime.split("").map((char, index) => (
              <span key={index} className="inline-block w-[1ch] text-center">
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-1 text-center text-xs italic text-white/80 md:text-sm">
          <ClockIcon />
          {timeMessage}
        </div>
      </div>
    </div>
  );
}
