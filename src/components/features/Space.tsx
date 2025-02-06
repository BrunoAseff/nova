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
import { useCallback, useEffect, useRef, useState } from "react";
import Shortcut from "../shortcuts/shortcut";
import { useInteractionLock } from "@/contexts/InteractionLockContext";
import { fetchSpacesData } from "@/server/actions/spaces/spaces";
import BreathingExercise from "./breathingExercise/BreathingExercise";
import Reminder from "./Reminder";
import SyncingInfo from "../syncingInfo";
import { SpaceSidebarMobile } from "../sidebar/SpaceSidebarMobile";
import { useSession } from "next-auth/react";
import { AutoSaveProvider } from "../autoSaveProvider";
import FullscreenButton from "../FullScreenButton";
import type { Changes } from "@/types/changes";

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
    setAmbientSound,
    setReminderMessages,
  } = useSpacesContext();
  const { setOpen } = useSidebar();
  const [sidebarShortcut, setSidebarShortcut] = useState("⌘B");
  const { isSelectOpen, lastSelectCloseTime } = useInteractionLock();
  const { data: session } = useSession();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const changes = localStorage.getItem("nova-changes");
      if (!changes) return;

      const { pending } = JSON.parse(changes) as Changes;
      if (pending.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const fetchSpaces = async () => {
      const { spaces, shortcut, ambientSound, reminderMessages } =
        await fetchSpacesData({ userId: session?.user?.id });

      setSpaces(spaces);
      setShortcut(shortcut);
      setAmbientSound(ambientSound);
      setReminderMessages(reminderMessages);
    };

    fetchSpaces();
  }, [session, setSpaces, setShortcut, setAmbientSound, setReminderMessages]);

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
    <AutoSaveProvider userId={session?.user?.id}>
      <TooltipProvider>
        <FullscreenButton contentRef={contentRef} />
        <Shortcut />
        <SyncingInfo />
        <Tabs
          ref={contentRef}
          defaultValue="2"
          className="relative m-0 h-dvh w-full overflow-hidden p-0 font-sans"
          aria-label="Space selection tabs"
        >
          <TabsList className="absolute bottom-6 left-8 z-10 md:bottom-10 md:left-auto md:right-28">
            {[...spaces]
              .sort((a, b) => a.id - b.id)
              .map((space) => (
                <TabsTrigger
                  aria-label={space.name}
                  aria-labelledby="tooltip"
                  onClick={() => selectTab(space.id)}
                  className="hover:bg-accent-foreground hover:text-foreground"
                  key={space.id}
                  value={space.id.toString()}
                >
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <span>{space.icon}</span>
                    </TooltipTrigger>
                    <TooltipContent
                      id="tooltip"
                      className="font-inter font-medium"
                    >
                      {space.name}
                    </TooltipContent>
                  </Tooltip>
                </TabsTrigger>
              ))}
          </TabsList>
          {[...spaces]
            .sort((a, b) => a.id - b.id)
            .map((space) => (
              <TabsContent
                className={`relative inset-0 m-0 h-screen w-screen overflow-hidden bg-cover bg-center p-0 ${LOADING_BG_COLOR}`}
                key={space.id}
                value={space.id.toString()}
              >
                <div className={`absolute inset-0 ${LOADING_BG_COLOR}`} />

                {space.id === 2 && (
                  <link as="image" href={space.background} key={space.id} />
                )}

                <div className="absolute inset-0 z-0">
                  <Image
                    src={space.background}
                    alt={space.name}
                    fill
                    className="object-cover brightness-75"
                    placeholder="blur"
                    blurDataURL="/blur/blurBackground.png"
                    priority={space.id === 2}
                    sizes="100vw"
                    quality={85}
                    loading={space.id === 2 ? "eager" : "lazy"}
                    fetchPriority={space.id === 2 ? "high" : "auto"}
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
              className="show-in-fullscreen absolute bottom-10 right-14 z-10 hidden overflow-hidden rounded-xl bg-background p-5 text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground md:flex md:p-5"
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
    </AutoSaveProvider>
  );
}
