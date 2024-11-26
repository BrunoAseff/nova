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
    type: ["Nature"],
  },
  {
    name: "Rain",
    url: "https://utfs.io/f/C3k2e5UQDa97VbQ2nxFFhCzlGAs7XH09cb8NjMWwamyqpgoS",
    type: ["Weather"],
  },
];
