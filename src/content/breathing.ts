export type BreathStep = { kind: "in" | "hold" | "out"; seconds: number; label?: string };

/** Técnicas de respiração e o ritmo de cada uma (um ciclo; o widget repete). */
export const breathingTechniques = [
  {
    id: "box",
    name: "Box breathing",
    steps: [
      { kind: "in", seconds: 4 },
      { kind: "hold", seconds: 4 },
      { kind: "out", seconds: 4 },
      { kind: "hold", seconds: 4 },
    ],
  },
  {
    id: "4-7-8",
    name: "4-7-8",
    steps: [
      { kind: "in", seconds: 4 },
      { kind: "hold", seconds: 7 },
      { kind: "out", seconds: 8 },
    ],
  },
  {
    id: "alternate-nostril",
    name: "Alternate nostril",
    steps: [
      { kind: "in", seconds: 4, label: "Breathe in, left" },
      { kind: "out", seconds: 4, label: "Breathe out, right" },
      { kind: "in", seconds: 4, label: "Breathe in, right" },
      { kind: "out", seconds: 4, label: "Breathe out, left" },
    ],
  },
  {
    id: "wim-hof",
    name: "Wim Hof",
    steps: [
      { kind: "in", seconds: 2 },
      { kind: "out", seconds: 2 },
    ],
  },
] as const satisfies readonly { id: string; name: string; steps: readonly BreathStep[] }[];

export type BreathingTechniqueId = (typeof breathingTechniques)[number]["id"];

export const breathingTechniqueIds = breathingTechniques.map((t) => t.id) as [
  BreathingTechniqueId,
  ...BreathingTechniqueId[],
];
