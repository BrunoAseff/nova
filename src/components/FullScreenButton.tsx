"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowsIn } from "@phosphor-icons/react";
import FullScreenIcon from "./icons/FullScreenIcon";

interface FullscreenButtonProps {
  contentRef: RefObject<HTMLElement>;
}

const FullscreenButton = ({ contentRef }: FullscreenButtonProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!contentRef.current) return;

    try {
      if (!isFullscreen) {
        await contentRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          aria-labelledby="full-screen"
          aria-label="full-screen"
          onClick={toggleFullscreen}
          className="absolute bottom-10 right-[21rem] z-10 hidden overflow-hidden rounded-xl border-[2px] border-muted bg-background p-5 text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground md:flex md:p-5"
        >
          {isFullscreen ? <ArrowsIn size={17} /> : <FullScreenIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        id="full-screen"
        className="font-inter flex items-center gap-3 font-medium"
      >
        {isFullscreen ? "Exit full screen" : "Full screen"}
      </TooltipContent>
    </Tooltip>
  );
};

export default FullscreenButton;
