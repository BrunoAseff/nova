"use client";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Clock from "./Clock";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pomodoro from "./pomodoro/Pomodoro";
import Quote from "./quotes/Quote";
import { Button } from "../ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { AnimatedConfig } from "../icons/animatedIcons/AnimatedConfig";
import { useCallback, useEffect, useState } from "react";
import Shortcut from "../shortcuts/shortcut";
import { useInteractionLock } from "@/contexts/InteractionLockContext";
import { fetchSpacesData } from "@/server/actions/spaces";

const LOADING_BG_COLOR = "bg-gray-900";

declare global {
  interface Navigator {
    userAgentData?: {
      platform: string;
    };
  }
}

export default function Space() {
  const { selectTab, spaces, setSpaces } = useSpacesContext();
  const { setOpen } = useSidebar();
  const [shortcut, setShortcut] = useState("⌘B");
  const { isSelectOpen, lastSelectCloseTime } = useInteractionLock();

  useEffect(() => {
    const fetchSpaces = async () => {
      const data = await fetchSpacesData();

      setSpaces(data);
    };

    fetchSpaces();
  }, [setSpaces]);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    const detectPlatform = () => {
      if ("userAgentData" in navigator && navigator.userAgentData?.platform) {
        return navigator.userAgentData.platform.toLowerCase() === "windows"
          ? "Ctrl B"
          : "⌘B";
      }

      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
      return isMac ? "⌘B" : "Ctrl B";
    };

    setShortcut(detectPlatform());

    const handleOutsideClick = (event: MouseEvent) => {
      // Check if this click is happening right after a select close
      const timeSinceLastSelectClose = Date.now() - lastSelectCloseTime.current;
      if (timeSinceLastSelectClose < 100) {
        // 100ms threshold
        return;
      }

      if (isSelectOpen) {
        return;
      }

      const sidebar = document.querySelector("[data-sidebar]");
      const excludedElements = document.querySelectorAll(
        "[data-sidebar-exclude]",
      );

      const isOutsideSidebar =
        sidebar && !sidebar.contains(event.target as Node);
      const isNotExcluded = Array.from(excludedElements).every(
        (el) => !el.contains(event.target as Node),
      );

      if (!isOutsideSidebar || !isNotExcluded) {
        return;
      }

      closeSidebar();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeSidebar, isSelectOpen, lastSelectCloseTime]);

  return (
    <TooltipProvider>
      <Shortcut />

      <Tabs
        defaultValue="Focus"
        className="relative m-0 h-screen w-full overflow-hidden p-0 font-sans"
        aria-label="Space selection tabs"
      >
        <TabsList className="absolute bottom-10 right-28 z-10">
          {spaces.map((space) => (
            <TabsTrigger
              onClick={() => selectTab(space.name)}
              className="hover:bg-accent-foreground hover:text-foreground"
              key={space.name}
              value={space.name}
            >
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <span>{space.icon}</span>
                </TooltipTrigger>
                <TooltipContent className="font-open font-light">
                  {space.name}
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
          ))}
        </TabsList>
        {spaces.map((space) => (
          <TabsContent
            className={`relative inset-0 m-0 h-screen w-screen overflow-hidden bg-cover bg-center p-0 ${LOADING_BG_COLOR}`}
            key={space.name}
            value={space.name}
          >
            {/* Add initial colored background div */}
            <div className={`absolute inset-0 ${LOADING_BG_COLOR}`} />

            {/* Preload the first background image */}
            <link
              rel="preload"
              as="image"
              href={spaces[0]?.background}
              key={spaces[0]?.name}
            />

            <div className="absolute inset-0 z-0">
              <Image
                src={space.background}
                alt={space.name}
                fill
                className="object-cover brightness-75"
                placeholder="blur"
                blurDataURL="/blur/blurBackground.png"
                priority={space.name === "Focus"}
                sizes="100vw"
                quality={100}
                loading={space.name === "Focus" ? "eager" : "lazy"}
              />
            </div>
            <div className="relative z-10">
              <Clock {...space.clock} />
              <Pomodoro {...space.pomodoro} />
              <Quote {...space.quote} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={() => setOpen(true)}
            className="absolute bottom-10 right-14 z-10 overflow-hidden rounded-xl bg-background text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground"
          >
            <AnimatedConfig />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-3 font-open font-light">
          Config
          <p className="rounded-xl text-xs tracking-widest text-secondary">
            {shortcut}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
