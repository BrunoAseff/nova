"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import type { ClockProps } from "@/types";

export default function Clock(props: ClockProps) {
  const { timeFormat, position, isHidden = false } = props;
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime =
        timeFormat === "12h" ? format(now, "hh:mm a") : format(now, "HH:mm");
      setCurrentTime(formattedTime);
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
        return "top-0 left-0 m-20";
      case "top-right":
        return "top-0 right-0 m-20";
      case "bottom-left":
        return "bottom-0 left-0 m-20";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      default:
        return "";
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`fixed shadow-foreground drop-shadow-xl ${positionClass()} border-1 flex items-center justify-center text-foreground`}
    >
      <span className="flex items-center space-x-1 rounded-3xl bg-background p-10 text-center font-open text-5xl font-extralight text-foreground">
        {currentTime.split("").map((char, index) => (
          <span key={index} className="inline-block w-[1ch] text-center">
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}
