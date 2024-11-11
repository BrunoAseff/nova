"use client";
import * as React from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import SpacePicker from "./SpacePicker";
import IconBtn from "../nova/buttons/IconBtn";
import { Close } from "../icons/Close";
import { SidebarTabs, TabsContent, TabsList, TabsTrigger } from "./SidebarTabs";
import { Separator } from "../ui/separator";
import { Tools } from "../icons/Tools";
import ClockTab from "./tabs/ClockTab";
import { ClockIcon } from "../icons/Clock";
import { PomodoroIcon } from "../icons/featureIcons/PomodoroIcon";
import { QuoteIcon } from "../icons/featureIcons/QuoteIcon";
import { BackgroundIcon } from "../icons/featureIcons/BackgroundIcon";
import PomodoroTab from "./tabs/PomodoroTab";
import QuoteTab from "./tabs/QuoteTab";

export function SpaceSidebar() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" variant="floating" side="right">
      <IconBtn
        onClick={() => setOpen(false)}
        className="absolute right-5 top-5 rounded-full border-[1px] border-background bg-background text-destructive hover:border-destructive hover:bg-red-700/20"
        variant="destructive"
      >
        <Close />
      </IconBtn>

      <div className="h-full overflow-x-hidden">
        <SpacePicker />
        <SidebarTabs
          defaultValue="clock"
          orientation="vertical"
          className="m-5 flex h-fit w-full items-start gap-4 bg-none"
        >
          <TabsList className="mt-[13%] flex min-w-[25%] flex-col gap-6 text-left text-lg">
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
          </TabsList>
          <Separator orientation="vertical" />
          <div>
            <TabsContent
              className="w-full items-center justify-center"
              value="clock"
            >
              <ClockTab />
            </TabsContent>
            <TabsContent
              className="w-full items-center justify-center"
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
              <div className="flex flex-col items-center justify-center gap-2 text-2xl text-muted-foreground">
                <p>Under construction… </p>
                <Tools />
              </div>
            </TabsContent>
          </div>
        </SidebarTabs>
      </div>
    </Sidebar>
  );
}
