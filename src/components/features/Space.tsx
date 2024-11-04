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
} from "@/components/ui/Tooltip";
import Pomodoro from "./pomodoro/Pomodoro";
import Quote from "./quotes/Quote";

// Add a loading state background color
const LOADING_BG_COLOR = "bg-gray-900";

export default function Space() {
  const { state } = useSpacesContext();
  const { spaces } = state;

  return (
    <TooltipProvider>
      <Tabs
        defaultValue="Focus"
        className="relative m-0 w-full overflow-hidden p-0 font-sans"
        aria-label="Space selection tabs"
      >
        <TabsList className="absolute bottom-10 right-10 z-10">
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
            className={`relative m-0 h-screen w-screen bg-cover bg-center p-0 ${LOADING_BG_COLOR}`}
            key={space.name}
            value={space.name}
          >
            {/* Add initial colored background div */}
            <div className={`absolute inset-0 ${LOADING_BG_COLOR}`} />

            {/* Preload the first background image */}
            {spaces[0] && (
              <link
                rel="preload"
                as="image"
                href={spaces[0].background}
                key={spaces[0].name}
              />
            )}

            <div className="absolute inset-0 z-0">
              <Image
                src={space.background}
                alt={space.name}
                fill
                className="object-cover brightness-90"
                placeholder="blur"
                blurDataURL="/blur/blurBackground.png"
                priority={space.name === "Focus"} // Only prioritize the first/default background
                sizes="100vw"
                quality={75} // Slightly reduce quality for faster load
                loading={space.name === "Focus" ? "eager" : "lazy"} // Lazy load non-primary backgrounds
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
    </TooltipProvider>
  );
}
