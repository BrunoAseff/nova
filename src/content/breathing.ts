/** Técnicas de respiração. Os ritmos de cada uma entram junto com o widget (item 3). */
export const breathingTechniques = [
  { id: "box", name: "Box Breathing" },
  { id: "4-7-8", name: "4-7-8" },
  { id: "alternate-nostril", name: "Alternate Nostril Breathing" },
  { id: "wim-hof", name: "Wim Hof Method" },
] as const;

export type BreathingTechniqueId = (typeof breathingTechniques)[number]["id"];

export const breathingTechniqueIds = breathingTechniques.map((t) => t.id) as [
  BreathingTechniqueId,
  ...BreathingTechniqueId[],
];
