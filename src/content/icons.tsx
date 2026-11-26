import {
  Bird,
  BookOpen,
  CloudRain,
  CloudRainWind,
  Coffee,
  Fish,
  Flame,
  House,
  Leaf,
  type LucideIcon,
  Moon,
  Shell,
  Sprout,
  Sun,
  Target,
  TreePalm,
  Waves,
} from "lucide-react";
import type { AmbientSoundId } from "./sounds";
import type { SpaceIcon } from "./space-icons";

/**
 * Ícones provisórios (Lucide). A biblioteca própria vem da skill generate-icons, quando
 * o visual estiver aprovado; trocar aqui troca no app inteiro.
 */
export const SPACE_ICON: Record<SpaceIcon, LucideIcon> = {
  home: House,
  focus: Target,
  relax: Leaf,
  book: BookOpen,
  coffee: Coffee,
  leaf: Sprout,
  moon: Moon,
  sun: Sun,
};

export const SOUND_ICON: Record<AmbientSoundId, LucideIcon> = {
  "ocean-waves": Waves,
  rain: CloudRain,
  "heavy-rain": CloudRainWind,
  birds: Bird,
  fire: Flame,
  beach: Shell,
  tropical: TreePalm,
  "crowded-cafe": Coffee,
  underwater: Fish,
};
