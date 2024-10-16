"use client";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Clock from "./Clock";
import Image from "next/image";

export default function Space() {
  const { state } = useSpacesContext();
  const { spaces } = state;

  return (
    <Tabs defaultValue={spaces[0]?.name} className="relative m-0 w-full p-0">
      <TabsList className="absolute bottom-6 right-6 z-10">
        {spaces.map((space) => (
          <TabsTrigger key={space.name} value={space.name}>
            {space.name}
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
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10">
            <Clock {...space.clock} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
