"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SpacePicker from "./SpacePicker";
import { SidebarTabs, TabsContent, TabsList, TabsTrigger } from "./SidebarTabs";
import ClockTab from "./tabs/ClockTab";

import BackgroundTab from "./tabs/BackgroundTab";
import AmbientSoundTab from "./tabs/AmbientSoundTab";
import MusicTab from "./tabs/MusicTab";
import ReminderTab from "./tabs/ReminderTab";
import BreathingExerciseTab from "./tabs/BreathingExerciseTab";
import SpacesTab from "./tabs/SpacesTab";
import AppearanceTab from "./tabs/AppearanceTab";
import ProfileTab from "./tabs/ProfileTab";
import {
  Alarm,
  ArrowCircleRight,
  Exclude,
  HourglassHigh,
  Images,
  LightbulbFilament,
  MusicNotes,
  Palette,
  Quotes,
  UserCircle,
  Waveform,
  Wind,
  XCircle,
} from "@phosphor-icons/react";
import PomodoroTab from "./tabs/PomodoroTab";
import QuoteTab from "./tabs/QuoteTab";
import { SessionProvider } from "next-auth/react";
import { Button } from "../ui/button";
import { AnimatedConfig } from "../icons/animatedIcons/AnimatedConfig";
import IconBtn from "../nova/buttons/IconBtn";
import { useState } from "react";

export function SpaceSidebarMobile() {
  const [isTabListOpen, setIsTabListOpen] = useState(false);
  const toggleTabList = () => {
    setIsTabListOpen(!isTabListOpen);
  };

  return (
    <div className="block md:hidden">
      <SessionProvider>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              aria-labelledby="config"
              aria-label="Open config"
              className="absolute bottom-10 right-14 z-10 overflow-hidden rounded-xl bg-background text-sm text-muted-foreground shadow-md animate-in fade-in-0 hover:bg-background hover:text-foreground"
            >
              <AnimatedConfig />
            </Button>
          </SheetTrigger>

          <SheetContent className="min-w-full overflow-hidden bg-background">
            <SheetTitle className="absolute left-3 top-1 text-muted-foreground">
              <IconBtn aria-label="Close Sheet" onClick={toggleTabList}>
                {isTabListOpen ? (
                  <XCircle weight="duotone" size={26} />
                ) : (
                  <ArrowCircleRight weight="duotone" size={26} />
                )}
              </IconBtn>
            </SheetTitle>
            <SpacePicker />
            <SidebarTabs
              defaultValue="clock"
              orientation="vertical"
              className="z-50 ml-5 mt-5 flex h-screen w-full items-start justify-start gap-4"
            >
              <TabsList
                onClick={() => setIsTabListOpen(false)}
                className={`scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent absolute ${
                  isTabListOpen ? "left-2" : "-left-56"
                } z-[99] flex h-screen max-h-[90%] w-[60%] min-w-[26%] flex-col items-start justify-start gap-3 overflow-y-auto rounded-lg border-[1px] border-accent/60 bg-background p-2 pb-6 pl-0 pr-2 text-left text-xs transition-all duration-300`}
              >
                <TabsTrigger className="flex items-center gap-2" value="clock">
                  <Alarm size={21} weight="duotone" />
                  Clock
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="pomodoro"
                >
                  <HourglassHigh size={21} weight="duotone" />
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="background"
                >
                  <Images size={21} weight="duotone" />
                  Background
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="quote">
                  <Quotes size={21} weight="duotone" />
                  Quote
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="ambientSound"
                >
                  <Waveform size={21} weight="duotone" />
                  Ambient Sound
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="music">
                  <MusicNotes size={21} weight="duotone" />
                  Music
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="reminder"
                >
                  <LightbulbFilament size={21} weight="duotone" />
                  Reminder
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="breathing"
                >
                  <Wind size={21} weight="duotone" />
                  Breathing Exercise
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="spaces">
                  <Exclude size={21} weight="duotone" />
                  Spaces
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="appearance"
                >
                  <Palette size={21} weight="duotone" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger
                  className="flex items-center gap-2"
                  value="profile"
                >
                  <UserCircle size={21} weight="duotone" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <div>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="clock"
                >
                  <ClockTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 h-full max-w-[70%] items-center justify-center"
                  value="pomodoro"
                >
                  <PomodoroTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="quote"
                >
                  <QuoteTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="background"
                >
                  <BackgroundTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="ambientSound"
                >
                  <AmbientSoundTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="music"
                >
                  <MusicTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="reminder"
                >
                  <ReminderTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="breathing"
                >
                  <BreathingExerciseTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="spaces"
                >
                  <SpacesTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="appearance"
                >
                  <AppearanceTab />
                </TabsContent>
                <TabsContent
                  className="text-md mt-2 max-w-[70%] items-center justify-center"
                  value="profile"
                >
                  <ProfileTab />
                </TabsContent>
              </div>
            </SidebarTabs>
          </SheetContent>
        </Sheet>
      </SessionProvider>
    </div>
  );
}
