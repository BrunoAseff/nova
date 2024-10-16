"use client";
import { useSpacesContext } from "@/contexts/spaceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Clock from "./Clock";

export default function Space() {
  const { state } = useSpacesContext();
  const { spaces } = state;

  return (
    <Tabs defaultValue={spaces[0]?.name} className="relative w-full">
      <TabsList className="absolute bottom-6 right-6">
        {spaces.map((space) => (
          <TabsTrigger key={space.name} value={space.name}>
            {space.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {spaces.map((space) => (
        <TabsContent
          className="h-screen w-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${space.background})` }}
          key={space.name}
          value={space.name}
        >
          <Clock {...space.clock} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
