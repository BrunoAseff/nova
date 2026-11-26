import riverPath from "@/assets/backgrounds/river-path.webp";

/**
 * Catálogo de fundos. O estado guarda só o `id`; a URL sai daqui.
 * Provisório: um fundo do v1 só para validar o pipeline. A curadoria nova é o item 4 do roadmap.
 * As imagens são importadas pelo Vite, então saem no build com hash no nome e cache imutável.
 */
export const backgrounds = [{ id: "river-path", name: "River Path", url: riverPath }] as const;

export type Background = (typeof backgrounds)[number];
export type BackgroundId = Background["id"];

export const backgroundIds = backgrounds.map((b) => b.id) as [BackgroundId, ...BackgroundId[]];
export const DEFAULT_BACKGROUND_ID: BackgroundId = "river-path";

export function getBackground(id: string): Background {
  return backgrounds.find((b) => b.id === id) ?? backgrounds[0];
}
