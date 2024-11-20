export type Color =
  | "Green"
  | "Yellow"
  | "Orange"
  | "Red"
  | "Pink"
  | "Purple"
  | "Blue";
export type Environment =
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
  {
    name: "Snowy Village",
    url: "https://utfs.io/f/C3k2e5UQDa97C0xLTzUQDa97Iph6GyEiXlKSb4T2gLm38jfv",
    AIgenerated: true,
    environment: ["Nature", "Exterior", "Urban"],
    color: ["Orange"],
  },
  {
    name: "Snowy Town",
    url: "https://utfs.io/f/C3k2e5UQDa97S6U0ilOePR7Q1kdFuxXnho4r9BwGHfzIvE62",
    AIgenerated: true,
    environment: ["Urban", "Exterior"],
    color: ["Yellow", "Blue"],
  },
  {
    name: "Tropical Beach",
    url: "https://utfs.io/f/C3k2e5UQDa97VCSXUCFFhCzlGAs7XH09cb8NjMWwamyqpgoS",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Blue", "Green"],
  },
  {
    name: "Study Desk",
    url: "https://utfs.io/f/C3k2e5UQDa977mf9rk3QSgKEy6P3XRVFpAUut0Nr4j5TWbox",
    AIgenerated: true,
    environment: ["Interior", "Home"],
    color: ["Green", "Yellow"],
  },
  {
    name: "Spring Mountains",
    url: "https://utfs.io/f/C3k2e5UQDa978XYNPAeNEXAsdvYOtoDCgkcxwzbWpPGliarf",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Blue", "Green"],
  },
  {
    name: "Winter River",
    url: "https://utfs.io/f/C3k2e5UQDa973OJ7VjtFfXEidH8voerSJwIWZbN290sKV1uA",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Blue"],
  },
  {
    name: "Underwater Coral",
    url: "https://utfs.io/f/C3k2e5UQDa976FoLYWQiuIYh8o5ALpQi7DfyXPmj1Jk2KbHS",
    AIgenerated: true,
    environment: ["Underwater"],
    color: ["Blue", "Green", "Pink"],
  },
  {
    name: "Lofi Desk",
    url: "https://utfs.io/f/C3k2e5UQDa97oa54Z0zYs2RU3CV7Lg5mwGXeZpBJD4FAEf9T",
    AIgenerated: true,
    environment: ["Interior", "Home"],
    color: ["Orange", "Pink"],
  },
  {
    name: "Countryside Farmhouse",
    url: "https://utfs.io/f/C3k2e5UQDa97y2SOkr9cqGPsb7SQOBHKydVteUNn3roRwFiI",
    AIgenerated: true,
    environment: ["Nature", "Exterior", "Urban"],
    color: ["Green", "Yellow", "Blue"],
  },
  {
    name: "Green Field",
    url: "https://utfs.io/f/C3k2e5UQDa97QJVFrk5feZREi0MsQ2bqLCGygxKtDAOzkHFp",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Green", "Blue"],
  },
  {
    name: "Comfortable Room",
    url: "https://utfs.io/f/C3k2e5UQDa97TTL9SBW25bLAy4PQEaKIVndol0w8C7tkGmiz",
    AIgenerated: true,
    environment: ["Interior", "Home"],
    color: ["Green", "Yellow", "Blue"],
  },
  {
    name: "Mysterious Forest",
    url: "https://utfs.io/f/C3k2e5UQDa97onLc7CzYs2RU3CV7Lg5mwGXeZpBJD4FAEf9T",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Purple", "Blue"],
  },
  {
    name: "Countryside Hills",
    url: "https://utfs.io/f/C3k2e5UQDa97Me5yDBR3JFIrwt6CGugmhq9aQXeHRvS8npBk",
    AIgenerated: true,
    environment: ["Nature", "Exterior"],
    color: ["Green", "Yellow", "Blue"],
  },
  {
    name: "Viking Castle",
    url: "https://utfs.io/f/C3k2e5UQDa97y7KbB59cqGPsb7SQOBHKydVteUNn3roRwFiI",
    AIgenerated: true,
    environment: ["Fantasy", "Exterior"],
    color: ["Blue", "Orange"],
  },
];
