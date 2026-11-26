import riverPath from "@/assets/backgrounds/river-path.webp";

/**
 * Provisório: um fundo do v1 só para validar o pipeline. A curadoria nova é o item 4 do roadmap.
 * As imagens são importadas pelo Vite, então saem no build com hash no nome e cache imutável.
 */
export const backgrounds = [{ id: "river-path", name: "River Path", url: riverPath }] as const;

export type Background = (typeof backgrounds)[number];
