"use client";
import * as React from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import SpacePicker from "./SpacePicker";
import IconBtn from "../nova/buttons/IconBtn";
import { Close } from "../icons/Close";
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
import { Pause } from "@/components/icons/pause";
import { Play } from "@/components/icons/Play";
import {
  Alarm,
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
} from "@phosphor-icons/react";
import PomodoroTab from "./tabs/PomodoroTab";
import QuoteTab from "./tabs/QuoteTab";
import { SessionProvider } from "next-auth/react";
import { MutedVolumeIcon } from "../icons/MutedVolumeIcon";
import { VolumeIcon } from "../icons/VolumeIcon";
import { Slider } from "../ui/slider";
import { useAmbientSound } from "@/stores/useAmbientSound";

export function SpaceSidebar() {
  const { setOpen } = useSidebar();

  const {
    ambientSoundVolume,
    isPlaying,
    toggleMute,
    togglePlayPause,
    handleVolumeChange,
  } = useAmbientSound();

  return (
    <SessionProvider>
      <Sidebar
        className="sidebar"
        collapsible="offcanvas"
        variant="floating"
        side="right"
      >
        <IconBtn
          aria-label="Close Sidebar"
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 z-50 rounded-full border-[1px] border-background bg-background font-montserrat text-foreground hover:border-destructive hover:bg-red-700/20 hover:text-destructive"
          variant="destructive"
        >
          <Close />
        </IconBtn>

        <div className="overflow-hidden bg-transparent">
          <SpacePicker />
          <SidebarTabs
            defaultValue="clock"
            orientation="vertical"
            className="z-50 ml-5 mt-5 flex h-screen w-full items-start justify-start gap-4"
          >
            <TabsList className="scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent flex h-[100%] max-h-[85%] w-[26%] min-w-[26%] flex-col items-start justify-start gap-3 overflow-y-auto pb-6 pl-0 pr-2 text-left text-xs">
              <TabsTrigger className="flex items-center gap-2" value="clock">
                <Alarm size={21} weight="duotone" />
                Clock
              </TabsTrigger>
              <TabsTrigger className="flex items-center gap-2" value="pomodoro">
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
              <TabsTrigger className="flex items-center gap-2" value="reminder">
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
              <TabsTrigger className="flex items-center gap-2" value="profile">
                <UserCircle size={21} weight="duotone" />
                Profile
              </TabsTrigger>
            </TabsList>

            <div>
              <TabsContent
                className="w-full items-center justify-center"
                value="clock"
              >
                <ClockTab />
              </TabsContent>
              <TabsContent
                className="h-full w-full items-center justify-center"
                value="pomodoro"
              >
                <PomodoroTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="quote"
              >
                <QuoteTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="background"
              >
                <BackgroundTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="ambientSound"
              >
                <AmbientSoundTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="music"
              >
                <MusicTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="reminder"
              >
                <ReminderTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="breathing"
              >
                <BreathingExerciseTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="spaces"
              >
                <SpacesTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="appearance"
              >
                <AppearanceTab />
              </TabsContent>
              <TabsContent
                className="w-full items-center justify-center"
                value="profile"
              >
                <ProfileTab />
              </TabsContent>
            </div>

            <div className="absolute bottom-8 left-4 flex">
              <div className="hidden max-w-[14rem] items-center space-x-2 rounded-full bg-background p-3 md:flex">
                <IconBtn onClick={togglePlayPause}>
                  {isPlaying ? <Pause /> : <Play />}
                </IconBtn>
                <IconBtn onClick={toggleMute}>
                  {ambientSoundVolume === 0 ? (
                    <MutedVolumeIcon />
                  ) : (
                    <VolumeIcon />
                  )}
                </IconBtn>
                <Slider
                  value={[ambientSoundVolume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-24 cursor-pointer"
                />
              </div>
            </div>
          </SidebarTabs>
        </div>
      </Sidebar>
    </SessionProvider>
  );
}
