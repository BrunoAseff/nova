export type Type = "Nature" | "Urban" | "Meditation" | "Weather";

export interface Sound {
  name: string;
  url: string;
  type: Type[];
}

export const ambientSounds: Sound[] = [
  {
    name: "Ocean Waves",
    url: "https://utfs.io/f/C3k2e5UQDa972ez8jJ7CdSL1HsIwEuK4TvJXprUencqoxa8W",
    type: ["Weather"],
  },
  {
    name: "Rain",
    url: "https://utfs.io/f/C3k2e5UQDa97VbQ2nxFFhCzlGAs7XH09cb8NjMWwamyqpgoS",
    type: ["Weather"],
  },
  {
    name: "Birds",
    url: "https://utfs.io/f/C3k2e5UQDa97WTQC71EBFuaOGQx2LIlrNoCc4WghziYTn1fM",
    type: ["Nature"],
  },
  {
    name: "Fire",
    url: "https://utfs.io/f/C3k2e5UQDa97yBBbxWg9cqGPsb7SQOBHKydVteUNn3roRwFi",
    type: ["Nature"],
  },
  {
    name: "Underwater",
    url: "https://utfs.io/f/C3k2e5UQDa972Aov4t7CdSL1HsIwEuK4TvJXprUencqoxa8W",
    type: ["Nature"],
  },
  {
    name: "Crowded Cafe",
    url: "https://utfs.io/f/C3k2e5UQDa97FpzVlpNkdTZigupIF03RYrPwQks8GCSVxUBe",
    type: ["Urban"],
  },
  {
    name: "Beach",
    url: "https://utfs.io/f/C3k2e5UQDa977mRIgnlQSgKEy6P3XRVFpAUut0Nr4j5TWbox",
    type: ["Nature"],
  },
  {
    name: "Tropical",
    url: "https://utfs.io/f/C3k2e5UQDa97uuVPCvwRDbAWfmVcyi74YrQg1K2T9PZBCjs6",
    type: ["Nature"],
  },
  {
    name: "Heavy Rain",
    url: "https://utfs.io/f/C3k2e5UQDa97yriYJY9cqGPsb7SQOBHKydVteUNn3roRwFiI",
    type: ["Nature"],
  },
];
