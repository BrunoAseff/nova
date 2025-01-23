import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="z-50 flex w-full flex-col items-center justify-evenly md:flex-row">
      <div className="flex w-full flex-col items-center justify-center gap-4 px-6 text-2xl text-foreground md:ml-20 md:items-start md:justify-start md:px-0 md:text-5xl">
        <h1>Welcome to your mind&apos;s secret garden</h1>
        <Button className="scale-110 font-semibold">
          <Link href="/sign-in">Get started</Link>
        </Button>
      </div>
      <div className="aspect-[16/9] w-[200%]">
        <div className="relative scale-[0.70] overflow-hidden rounded-lg shadow-[0px_20px_1007px_10px] shadow-secondary/60">
          {!isVideoLoaded && <Skeleton className="h-full w-full" />}
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
      </div>
    </section>
  );
}
