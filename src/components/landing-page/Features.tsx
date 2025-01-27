import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import useEmblaCarousel from "embla-carousel-react";

const features = [
  {
    id: 1,
    image: "/features/feature_1.png",
    title: "Create Multiple Spaces",
    description:
      "Switch between different environments - all personalized to your unique needs.",
  },
  {
    id: 2,
    image: "/features/feature_1.png",
    title: "Immerse in Soothing Sounds",
    description:
      "Choose from calming ambient sounds to keep you focused or relaxed.",
  },
  {
    id: 3,
    image: "/features/feature_1.png",
    title: "Daily Gratitude Journey",
    description:
      "Create custom reminders to pause and reflect on what matters most to you.",
  },
  {
    id: 4,
    image: "/features/feature_1.png",
    title: "Words That Resonate",
    description: "Find your daily spark with hand-picked quotes.",
  },
  {
    id: 5,
    image: "/features/feature_1.png",
    title: "Scenic Backgrounds",
    description:
      "Transform your space with beautiful scenes - from serene ocean views to cozy cafés.",
  },
];

export default function Features() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    duration: 30,
    startIndex: 0,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (isPending) return;
    setIsPending(true);
    emblaApi?.scrollPrev();
    setTimeout(() => setIsPending(false), 300);
  }, [emblaApi, isPending]);

  const scrollNext = useCallback(() => {
    if (isPending) return;
    setIsPending(true);
    emblaApi?.scrollNext();
    setTimeout(() => setIsPending(false), 300);
  }, [emblaApi, isPending]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="mx-auto flex w-[90%] flex-col items-center justify-center">
      <h1 className="my-10 text-4xl font-[600] text-foreground">Features</h1>

      <div className="relative z-50">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8 pl-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`z-40 flex w-fit flex-none flex-col items-center gap-4 rounded-2xl border border-accent/60 p-6 transition-all duration-300 ${
                  index === selectedIndex ? "opacity-100" : "opacity-40"
                } bg-accent-foreground`}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={600}
                  height={160}
                  className="rounded-2xl"
                />
                <div className="flex w-full flex-col gap-1">
                  <h1 className="text-xl font-medium">{feature.title}</h1>
                  <p className="max-w-[70%] text-left text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={scrollPrev}
            disabled={isPending}
            className="bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground disabled:opacity-40"
            variant="icon"
          >
            <ArrowCircleLeft weight="duotone" size={32} />
          </Button>
          <Button
            onClick={scrollNext}
            disabled={isPending}
            className="bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground disabled:opacity-40"
            variant="icon"
          >
            <ArrowCircleRight weight="duotone" size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
}
