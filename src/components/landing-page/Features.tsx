import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AutoHeight from "embla-carousel-auto-height";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { AmbientSoundCard } from "./Cards/AmbientSoundCard";
import RemindersCard from "./Cards/RemindersCard";
import QuoteCard from "./Cards/QuoteCard";
import BackgroundCard from "./Cards/BackgroundCard";
import AppearanceCard from "./Cards/AppearanceCard";

const features = [
  {
    id: 1,
    title: "Personalize your theme",
    description:
      "Choose from a variety of carefully crafted themes to match your mood and style.",
    component: AppearanceCard,
  },
  {
    id: 2,
    title: "Immerse in soothing sounds",
    description:
      "Choose from calming ambient sounds to keep you focused or relaxed.",
    component: AmbientSoundCard,
  },
  {
    id: 3,
    title: "Grateful reminders",
    description:
      "Create custom reminders to pause and reflect on what matters most to you.",
    component: RemindersCard,
  },
  {
    id: 4,
    title: "Inspiration quotes",
    description: "Meaningful quotes that inspire and motivate.",
    component: QuoteCard,
  },
  {
    id: 5,
    title: "Scenic backgrounds",
    description:
      "Transform your space with beautiful scenes - from serene ocean views to cozy cafés.",
    component: BackgroundCard,
  },
];
export default function Features() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });

    // Initialize selected index
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  const scrollPrev = () => {
    if (isPending) return;
    setIsPending(true);
    api?.scrollPrev();
    setTimeout(() => setIsPending(false), 300);
  };

  const scrollNext = () => {
    if (isPending) return;
    setIsPending(true);
    api?.scrollNext();
    setTimeout(() => setIsPending(false), 300);
  };

  return (
    <div className="z-50 mx-auto flex w-[90%] flex-col items-center justify-center bg-background">
      <h1 className="mb-4 mt-0 text-4xl font-[500] text-foreground md:my-10">
        Features
      </h1>

      <div className="relative z-50">
        <div className="mb-8 flex justify-center gap-4">
          <Button
            onClick={scrollPrev}
            disabled={isPending}
            className="w-fit rounded-2xl border-accent/20 bg-accent-foreground px-3 py-6 text-muted-foreground hover:bg-accent-foreground/80 hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeft size={32} />
          </Button>
          <Button
            onClick={scrollNext}
            disabled={isPending}
            className="w-fit rounded-2xl border-accent/20 bg-accent-foreground px-3 py-6 text-muted-foreground hover:bg-accent-foreground/80 hover:text-foreground disabled:opacity-40"
          >
            <ArrowRight size={32} />
          </Button>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        <Carousel
          setApi={setApi}
          plugins={[AutoHeight()]}
          className="w-full"
          opts={{
            loop: true,
            align: "center",
            duration: 30,
            startIndex: 0,
          }}
        >
          <CarouselContent className="pl-8">
            {features.map((feature, index) => {
              const Component = feature.component;
              return (
                <CarouselItem
                  key={feature.id}
                  className="basis-auto pl-4 md:pl-8"
                >
                  <div
                    className={`z-40 flex max-w-[90vw] flex-none flex-col items-start gap-4 rounded-2xl border border-accent/20 p-6 transition-all duration-300 md:w-fit md:max-w-none ${
                      index === selectedIndex ? "opacity-100" : "opacity-40"
                    } bg-accent-foreground`}
                  >
                    <div className="flex max-w-none flex-col gap-1 md:max-w-[35vw]">
                      <h1 className="text-base font-medium md:text-xl">
                        {feature.title}
                      </h1>
                      <p className="hidden max-w-[85%] text-left text-sm text-muted-foreground md:block">
                        {feature.description}
                      </p>
                    </div>
                    <Component />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
