import { getBackground } from "@/content/backgrounds";
import { useActiveSpace } from "@/stores/spaces";

/**
 * L0 · Cena. A foto, o filtro da atmosfera (escurecer à noite, dessaturar na Noite) e o
 * scrim localizado: gradientes só onde há texto, não um véu sobre a imagem inteira.
 */
export function Scene() {
  const background = getBackground(useActiveSpace().backgroundId);
  return (
    <div className="scene absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        key={background.id}
        src={background.url}
        alt=""
        className="scene-image absolute inset-0 size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="scene-scrim absolute inset-0" />
    </div>
  );
}
