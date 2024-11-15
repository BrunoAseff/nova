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

const LOADING_BG_COLOR = "bg-gray-900";

export default function Space() {
  const { spaces } = useSpacesContext();

  const { setOpen } = useSidebar();

  return (
    <TooltipProvider>
      <Tabs
        defaultValue="Focus"
        className="relative m-0 h-screen w-full overflow-hidden p-0 font-sans"
        aria-label="Space selection tabs"
      >
        <TabsList className="absolute bottom-10 right-24 z-10">
          {spaces.map((space) => (
            <TabsTrigger key={space.name} value={space.name}>
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
                className="object-cover brightness-90"
                placeholder="blur"
                blurDataURL="/blur/blurBackground.png"
                priority={space.name === "Focus"}
                sizes="100vw"
                quality={75}
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
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={() => setOpen(true)}
            className="absolute bottom-10 right-10 z-10 overflow-hidden rounded-xl bg-background text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground"
          >
            <AnimatedConfig />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="font-open font-light">Config</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
