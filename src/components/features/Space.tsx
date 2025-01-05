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
import { fetchSpacesData } from "@/server/actions/spaces/spaces";
import BreathingExercise from "./breathingExercise/BreathingExercise";
import Reminder from "./Reminder";
import SyncingInfo from "../syncingInfo";
import { SpaceSidebarMobile } from "../sidebar/SpaceSidebarMobile";

const LOADING_BG_COLOR = "bg-gray-900";

declare global {
  interface Navigator {
    userAgentData?: {
      platform: string;
    };
  }
}

export default function Space() {
  const {
    selectTab,
    spaces,
    setSpaces,
    setShortcut,
    setAmbientSoundVolume,
    setAmbientSound,
    setReminderMessages,
  } = useSpacesContext();
  const { setOpen } = useSidebar();
  const [sidebarShortcut, setSidebarShortcut] = useState("⌘B");
  const { isSelectOpen, lastSelectCloseTime } = useInteractionLock();

  useEffect(() => {
    const fetchSpaces = async () => {
      const {
        spaces,
        shortcut,
        ambientSound,
        ambientSoundVolume,
        reminderMessages,
      } = await fetchSpacesData();

      setSpaces(spaces);
      setShortcut(shortcut);
      setAmbientSound(ambientSound);
      setAmbientSoundVolume(ambientSoundVolume);
      setReminderMessages(reminderMessages);
    };

    fetchSpaces();
  }, [
    setSpaces,
    setAmbientSound,
    setAmbientSoundVolume,
    setShortcut,
    setReminderMessages,
  ]);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    const detectPlatform = () => {
      if (navigator.userAgentData?.platform?.toLowerCase() === "windows") {
        return "Ctrl B";
      }
      return /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)
        ? "⌘B"
        : "Ctrl B";
    };

    setSidebarShortcut(detectPlatform());

    const handleOutsideClick = (event: MouseEvent) => {
      if (Date.now() - lastSelectCloseTime.current < 100) return;

      if (isSelectOpen) return;

      const sidebar = document.querySelector("[data-sidebar]");
      const excludedElements = document.querySelectorAll(
        "[data-sidebar-exclude]",
      );

      const isOutsideSidebar =
        sidebar && !sidebar.contains(event.target as Node);
      const isNotExcluded = Array.from(excludedElements).every(
        (el) => !el.contains(event.target as Node),
      );

      if (isOutsideSidebar && isNotExcluded) {
        closeSidebar();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeSidebar, isSelectOpen, lastSelectCloseTime]);

  return (
    <TooltipProvider>
      <Shortcut />
      <SyncingInfo />
      <Tabs
        defaultValue="Focus"
        className="relative m-0 h-screen w-full overflow-hidden p-0 font-sans"
        aria-label="Space selection tabs"
      >
        <TabsList className="absolute bottom-6 left-8 z-10 md:bottom-10 md:left-auto md:right-28">
          {spaces.map((space) => (
            <TabsTrigger
              aria-label={space.name}
              aria-labelledby="tooltip"
              onClick={() => selectTab(space.name)}
              className="hover:bg-accent-foreground hover:text-foreground"
              key={space.id}
              value={space.name}
            >
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <span>{space.icon}</span>
                </TooltipTrigger>
                <TooltipContent id="tooltip" className="font-inter font-medium">
                  {space.name}
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
          ))}
        </TabsList>
        {spaces.map((space) => (
          <TabsContent
            className={`relative inset-0 m-0 h-screen w-screen overflow-hidden bg-cover bg-center p-0 ${LOADING_BG_COLOR}`}
            key={space.id}
            value={space.name}
          >
            <div className={`absolute inset-0 ${LOADING_BG_COLOR}`} />

            {space.name === "Focus" && (
              <link
                rel="preload"
                as="image"
                href={space.background}
                key={space.id}
              />
            )}

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
              <BreathingExercise {...space.breathingExercise} />
              <Reminder {...space.reminder} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            aria-labelledby="config"
            aria-label="Open config"
            onClick={() => setOpen(true)}
            className="absolute bottom-10 right-14 z-10 hidden overflow-hidden rounded-xl bg-background text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground md:flex"
          >
            <AnimatedConfig />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          id="config"
          className="font-inter flex items-center gap-3 font-medium"
        >
          Config
          <p className="rounded-xl text-xs tracking-widest text-secondary">
            {sidebarShortcut}
          </p>
        </TooltipContent>
      </Tooltip>
      <SpaceSidebarMobile />
    </TooltipProvider>
  );
}
