"use client";
import * as React from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import SpacePicker from "./SpacePicker";
import IconBtn from "../nova/buttons/IconBtn";
import { Close } from "../icons/Close";
import { SidebarTabs, TabsContent, TabsList, TabsTrigger } from "./SidebarTabs";
import ClockTab from "./tabs/ClockTab";
import { ClockIcon } from "../icons/Clock";
import { PomodoroIcon } from "../icons/featureIcons/PomodoroIcon";
import { QuoteIcon } from "../icons/featureIcons/QuoteIcon";
import { BackgroundIcon } from "../icons/featureIcons/BackgroundIcon";
import PomodoroTab from "./tabs/PomodoroTab";
import QuoteTab from "./tabs/QuoteTab";
import { AmbientSoundIcon } from "../icons/featureIcons/AmbientSoundIcon";
import { MusicIcon } from "../icons/featureIcons/MusicIcon";
import { ReminderIcon } from "../icons/featureIcons/ReminderIcon";
import { BreathingIcon } from "../icons/featureIcons/BreathingIcon";
import { SpacesIcon } from "../icons/featureIcons/SpacesIcon";
import { AppearanceIcon } from "../icons/featureIcons/AppearanceIcon";
import { ProfileIcon } from "../icons/featureIcons/ProfileIcon";
import BackgroundTab from "./tabs/BackgroundTab";
import AmbientSoundTab from "./tabs/AmbientSoundTab";
import MusicTab from "./tabs/MusicTab";
import ReminderTab from "./tabs/ReminderTab";
import BreathingExerciseTab from "./tabs/BreathingExerciseTab";
import SpacesTab from "./tabs/SpacesTab";
import AppearanceTab from "./tabs/AppearanceTab";
import ProfileTab from "./tabs/ProfileTab";

export function SpaceSidebar() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" variant="floating" side="right">
      <IconBtn
        onClick={() => setOpen(false)}
        className="absolute right-5 top-5 z-50 rounded-full border-[1px] border-background bg-background text-foreground hover:border-destructive hover:bg-red-700/20 hover:text-destructive"
        variant="destructive"
      >
        <Close />
      </IconBtn>

      <div className="overflow-hidden bg-transparent">
        <SpacePicker />
        <SidebarTabs
          defaultValue="clock"
          orientation="vertical"
          className="ml-5 mt-5 flex h-fit w-full items-start gap-4 bg-none pb-4"
        >
          <TabsList className="mt-[36%] flex min-w-[25%] flex-col gap-4 text-left text-sm">
            <TabsTrigger className="flex items-center gap-2" value="clock">
              <ClockIcon className="ml-1 scale-125" />
              Clock
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="pomodoro">
              <PomodoroIcon />
              Pomodoro
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="background">
              <BackgroundIcon />
              Background
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="quote">
              <QuoteIcon />
              Quote
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-2"
              value="ambientSound"
            >
              <AmbientSoundIcon />
              Ambient Sound
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="music">
              <MusicIcon />
              Music
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="reminder">
              <ReminderIcon />
              Reminder
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="breathing">
              <BreathingIcon />
              Breathing Exercise
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="spaces">
              <SpacesIcon />
              Spaces
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="appearance">
              <AppearanceIcon />
              Appearance
            </TabsTrigger>
            <TabsTrigger className="flex items-center gap-2" value="profile">
              <ProfileIcon />
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
        </SidebarTabs>
      </div>
    </Sidebar>
  );
}
