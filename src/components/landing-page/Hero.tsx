import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="z-50 flex w-full flex-col items-center justify-evenly md:flex-row">
      <div className="flex flex-col items-center justify-center gap-4 px-6 text-2xl text-foreground md:ml-20 md:items-start md:justify-start md:px-0 md:text-5xl">
        <h1>A platform that helps you shine through focus and calm.</h1>
        <Button className="scale-110 font-semibold">Get started</Button>
      </div>
      <div className="relative scale-[0.70] overflow-hidden rounded-lg shadow-[0px_20px_1007px_10px] shadow-secondary/60">
        {!isVideoLoaded && (
          <Skeleton className="absolute inset-0 h-full w-full" />
        )}
        <video
          className={`h-full w-full scale-[1.1] object-cover ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/pomodoro.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
