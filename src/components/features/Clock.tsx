"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

type ClockProps = {
  timeFormat: "12h" | "24h";

  position: "top-left" | "top-right" | "bottom-left" | "center";
  isHidden?: boolean;
};

export default function Clock(props: ClockProps) {
  const { timeFormat, position, isHidden = false } = props;
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime =
        timeFormat === "12h"
          ? format(now, "hh:mm:ss a")
          : format(now, "HH:mm:ss");
      setCurrentTime(formattedTime);
    };

    updateCurrentTime();

    const interval = setInterval(() => {
      updateCurrentTime();
    }, 1000);

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
      className={`fixed ${positionClass()} flex h-[100px] w-[300px] items-center justify-center rounded-3xl bg-gradient-to-r from-card to-card-foreground text-secondary`}
    >
      <span className="text-4xl font-bold">{currentTime}</span>
    </div>
  );
}
