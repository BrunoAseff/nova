import riverPath from "@/assets/backgrounds/river-path.webp";

/**
 * Catálogo de fundos. O estado guarda só o `id`; a URL sai daqui.
 * As imagens são importadas pelo Vite, então saem no build com hash no nome e cache imutável.
 * A curadoria nova (fotos reais, com licença) é o item 4 do roadmap; a interface não muda.
 */
export interface Background {
  id: string;
  name: string;
  url: string;
  /** Versão pequena para o seletor. */
  thumb: string;
}

const production: Background[] = [
  { id: "river-path", name: "River Path", url: riverPath, thumb: riverPath },
];

/**
 * Só no protótipo (dev): os fundos do v1, servidos de `media/legacy/` (fora do git), para
 * desenhar o seletor com imagens de verdade. São gerados por IA e saem no item 4.
 * Miniaturas: `media/legacy/thumbs/`, 320×200 (geradas com ImageMagick).
 */
const LEGACY_NAMES = [
  "Ancient Babylon",
  "Clear Sky",
  "Comfortable Room",
  "Countryside Farmhouse",
  "Countryside Hills",
  "Fireplace at Home",
  "Green Field",
  "Horizon at Night",
  "Lofi Desk",
  "Mesh Gradient",
  "Messy Desk",
  "Mountains in Snow",
  "Mysterious Forest",
  "Northern Lights",
  "Pastel Gradient",
  "Pink Gradient",
  "Rainy Street",
  "Relaxed Bedroom",
  "Rocket Launch",
  "Serene Room",
  "Snowy Town",
  "Snowy Village",
  "Spring Mountains",
  "Stars in the Sky",
  "Study Desk",
  "Sunset Store",
  "Train in the Fields",
  "Tropical Beach",
  "Underwater Coral",
  "Urban Home",
  "Viking Castle",
  "White Pyramid",
  "Winter River",
];

const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");

const prototype: Background[] = import.meta.env.DEV
  ? LEGACY_NAMES.map((name) => ({
      id: slug(name),
      name,
      url: `/media/legacy/backgrounds/${slug(name)}.webp`,
      thumb: `/media/legacy/thumbs/${slug(name)}.webp`,
    }))
  : [];

export const backgrounds: readonly Background[] = [...production, ...prototype];

export type BackgroundId = string;

export const backgroundIds = backgrounds.map((b) => b.id) as [BackgroundId, ...BackgroundId[]];
export const DEFAULT_BACKGROUND_ID: BackgroundId = "river-path";

/** O fundo pedido, se existir no catálogo; senão o padrão (em produção só há um). */
export function backgroundOr(id: string): BackgroundId {
  return backgrounds.some((b) => b.id === id) ? id : DEFAULT_BACKGROUND_ID;
}

export function getBackground(id: string): Background {
  // biome-ignore lint/style/noNonNullAssertion: o catálogo de produção nunca é vazio
  return backgrounds.find((b) => b.id === id) ?? backgrounds[0]!;
}
