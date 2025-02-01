import Image from "next/image";

const FEATURED_BACKGROUNDS = [
  {
    url: "https://utfs.io/f/C3k2e5UQDa97QJVFrk5feZREi0MsQ2bqLCGygxKtDAOzkHFp",
    alt: "Green Field",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa97q5u7PyK3AnU62taIhXg1udLRSOWqxHmJYEwp",
    alt: "Sunset Store",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa97czxZa9BSHP9qsgFjyxtWURubVrkaThmp2A3i",
    alt: "Fireplace at home",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa973OJ7VjtFfXEidH8voerSJwIWZbN290sKV1uA",
    alt: "Winter River",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa9715lJJA3des8fHYobiMNpx0Z25hGRuCJ9ngSL",
    alt: "Messy Desk",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa97pSD5LBH6I70sTp2gAdSxjHJ4WG58XBnPbzqR",
    alt: "Relaxed Bedroom",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa97VCSXUCFFhCzlGAs7XH09cb8NjMWwamyqpgoS",
    alt: "Tropical Beach",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa97S6U0ilOePR7Q1kdFuxXnho4r9BwGHfzIvE62",
    alt: "Snowy Town",
  },
  {
    url: "https://utfs.io/f/C3k2e5UQDa976FoLYWQiuIYh8o5ALpQi7DfyXPmj1Jk2KbHS",
    alt: "Underwater Coral",
  },
] as const;

export const BackgroundCard = () => {
  return (
    <div className="mb-3 w-full min-w-[440px] items-center justify-center rounded-2xl border-accent bg-accent-foreground md:min-w-[640px]">
      <div className="relative">
        <div className="grid grid-cols-2 gap-6 pb-[1.5rem]">
          {FEATURED_BACKGROUNDS.map((background) => (
            <div
              key={background.url}
              className="relative aspect-[5/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={background.url}
                alt={background.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 300px"
                priority
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-accent-foreground via-accent-foreground/80 to-transparent"
          style={{ transform: "translateY(-20px)" }}
        />
      </div>
    </div>
  );
};

export default BackgroundCard;
