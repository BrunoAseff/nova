"use client";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Clock from "./Clock";
import Image from "next/image";
import { Leaf } from "../icons/leaf";
import { Home } from "../icons/Home";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export default function Space() {
  const { state } = useSpacesContext();
  const { spaces } = state;

  return (
    <TooltipProvider>
      <Tabs
        defaultValue={spaces[0]?.name}
        className={`relative m-0 w-full overflow-hidden p-0 font-sans`}
      >
        <TabsList className="absolute bottom-10 right-10 z-10">
          {spaces.map((space) => (
            <TabsTrigger key={space.name} value={space.name}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  {space.name === "Home" ? (
                    <Home color="currentColor" />
                  ) : space.name === "Focus" ? (
                    <Leaf color="currentColor" />
                  ) : (
                    space.name
                  )}
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
            className="relative m-0 h-screen w-screen bg-cover bg-center p-0"
            key={space.name}
            value={space.name}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={space.background}
                alt={space.name}
                fill
                className="object-cover brightness-75"
                placeholder="blur"
                blurDataURL="/blur/blurBackground.png"
                priority
              />
            </div>
            <div className="relative z-10">
              <Clock {...space.clock} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </TooltipProvider>
  );
}