import { assetUrl } from "@/lib/assets";

/** Provisório: os fundos do v1 só para validar o pipeline. A curadoria nova é o item 4 do roadmap. */
export const backgrounds = [
  { id: "river-path", name: "River Path", url: assetUrl("legacy/backgrounds/river-path.webp") },
] as const;

export type Background = (typeof backgrounds)[number];
