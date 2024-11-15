type Color = "Green" | "Yellow" | "Orange" | "Red" | "Pink" | "Purple" | "Blue";
type Environment =
  | "Nature"
  | "Urban"
  | "Home"
  | "Interior"
  | "Exterior"
  | "Space"
  | "Underwater"
  | "Fantasy"
  | "Abstract";

interface Background {
  name: string;
  url: string;
  AIgenerated: boolean;
  environment: Environment[];
  color: Color[];
}

export const backgrounds: Background[] = [
  {
    name: "River Path",
    url: "https://utfs.io/f/C3k2e5UQDa979nPTYgc69pKfgXcSlCYx1ADa82uERWQ3BFUM",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Blue", "Green"],
  },
  {
    name: "Urban Home",
    url: "https://utfs.io/f/C3k2e5UQDa97qNLJQrK3AnU62taIhXg1udLRSOWqxHmJYEwp",
    AIgenerated: true,
    environment: ["Urban", "Home", "Interior"],
    color: ["Yellow", "Orange"],
  },
  {
    name: "Train in the Fields",
    url: "https://utfs.io/f/C3k2e5UQDa97Ru9oGRCJOrwSdFfUARDM9K6WN4uP3YHB1tzj",
    AIgenerated: true,
    environment: ["Interior", "Nature"],
    color: ["Blue", "Green"],
  },
];
