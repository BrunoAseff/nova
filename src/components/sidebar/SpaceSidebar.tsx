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

export function SpaceSidebar() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" variant="floating" side="right">
      <IconBtn
        onClick={() => setOpen(false)}
        className="absolute right-5 top-5 rounded-full bg-background text-foreground hover:bg-destructive"
        variant="destructive"
      >
        <Close />
      </IconBtn>
      <SpacePicker />
      <SidebarTabs
        defaultValue="clock"
        orientation="vertical"
        className="m-5 flex h-[90%] w-full items-start gap-4 bg-none"
      >
        <TabsList className="mt-[13%] flex min-w-[25%] flex-col gap-6 text-left text-lg">
          <TabsTrigger value="clock">Clock</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="quote">Quote</TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" />
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
          <div className="flex flex-col items-center justify-center gap-2 text-2xl text-muted-foreground">
            <p>Under construction… </p>
            <Tools />
          </div>
        </TabsContent>
        <TabsContent
          className="w-full items-center justify-center"
          value="timer"
        >
          <div className="flex flex-col items-center justify-center gap-2 text-2xl text-muted-foreground">
            <p>Under construction… </p>
            <Tools />
          </div>
        </TabsContent>
        <TabsContent
          className="w-full items-center justify-center"
          value="quote"
        >
          <div className="flex flex-col items-center justify-center gap-2 text-2xl text-muted-foreground">
            <p>Under construction… </p>
            <Tools />
          </div>
        </TabsContent>
      </SidebarTabs>
    </Sidebar>
  );
}
