import { type RefObject, useEffect } from "react";
import { getBackground } from "@/content/backgrounds";
import { usePreferencesStore } from "@/stores/preferences";
import { selectActiveSpace, useSpacesStore } from "@/stores/spaces";

/**
 * Tinta adaptativa para o texto direto na cena (L1).
 *
 * Em vez de um halo escuro atrás de todo texto (que vira mancha em fotos claras), mede a
 * luminosidade da foto exatamente atrás do elemento e escolhe a tinta: clara com sombra
 * suave em fundo escuro, escura com brilho suave em fundo claro. Como o iOS faz na tela
 * de bloqueio.
 */
export type SceneTone = "dark" | "light" | "mixed";

/** Largura da amostra: suficiente para médias por região, barata de ler. */
const SAMPLE_WIDTH = 96;
/** Um pixel conta como claro acima desta luminância relativa (0–1). */
const BRIGHT_PIXEL = 0.35;
/**
 * Pela fração de pixels claros atrás do texto (a média engana em fundo misto, como céu
 * e árvore): quase tudo claro → tinta escura; quase tudo escuro → tinta clara; no meio,
 * tinta clara com sombra mais encorpada (difusa, nunca um borrão).
 */
const LIGHT_FROM = 0.6;
const DARK_UNTIL = 0.08;
/** O escuro aplica `brightness(0.68)` na foto (`--scene-filter`); a medida acompanha. */
const BRIGHTNESS: Record<"light" | "dark", number> = { light: 1, dark: 0.68 };

const samples = new Map<string, Promise<ImageData | null>>();

function sample(url: string): Promise<ImageData | null> {
  let pending = samples.get(url);
  if (!pending) {
    pending = (async () => {
      const image = new Image();
      image.src = url;
      try {
        await image.decode();
      } catch {
        return null;
      }
      const width = SAMPLE_WIDTH;
      const height = Math.max(1, Math.round((width * image.naturalHeight) / image.naturalWidth));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return null;
      context.drawImage(image, 0, 0, width, height);
      return context.getImageData(0, 0, width, height);
    })();
    samples.set(url, pending);
  }
  return pending;
}

const linear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** Fração de pixels claros na foto atrás de `rect`, com a foto em `object-fit: cover`. */
function brightShareBehind(data: ImageData, rect: DOMRect, brightness: number): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / data.width, vh / data.height);
  const offsetX = (vw - data.width * scale) / 2;
  const offsetY = (vh - data.height * scale) / 2;
  const clampX = (x: number) => Math.min(data.width - 1, Math.max(0, Math.floor(x)));
  const clampY = (y: number) => Math.min(data.height - 1, Math.max(0, Math.floor(y)));
  const x0 = clampX((rect.left - offsetX) / scale);
  const x1 = clampX((rect.right - offsetX) / scale);
  const y0 = clampY((rect.top - offsetY) / scale);
  const y1 = clampY((rect.bottom - offsetY) / scale);

  let bright = 0;
  let count = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * data.width + x) * 4;
      const r = linear(Math.min(255, (data.data[i] ?? 0) * brightness));
      const g = linear(Math.min(255, (data.data[i + 1] ?? 0) * brightness));
      const b = linear(Math.min(255, (data.data[i + 2] ?? 0) * brightness));
      if (0.2126 * r + 0.7152 * g + 0.0722 * b > BRIGHT_PIXEL) bright++;
      count++;
    }
  }
  return count === 0 ? 0 : bright / count;
}

/**
 * Marca o elemento com `data-tone` conforme a foto atrás dele. Recalcula quando muda o
 * fundo, o tema, o tamanho do elemento ou da janela, e depois que as animações de
 * entrada assentam.
 */
export function useSceneTone(ref: RefObject<HTMLElement | null>) {
  const backgroundId = useSpacesStore((s) => selectActiveSpace(s).backgroundId);
  const theme = usePreferencesStore((s) => s.theme);

  // biome-ignore lint/correctness/useExhaustiveDependencies: o tema muda o filtro da foto (lido do <html>), então medir de novo quando ele muda
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const url = getBackground(backgroundId).url;
    let cancelled = false;

    const measure = async () => {
      const data = await sample(url);
      if (cancelled || !data || !element.isConnected) return;
      // Lido na hora de medir, não ao montar o efeito: o tema no <html> muda depois.
      const resolved = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      const share = brightShareBehind(data, element.getBoundingClientRect(), BRIGHTNESS[resolved]);
      const tone: SceneTone =
        share >= LIGHT_FROM ? "light" : share <= DARK_UNTIL ? "dark" : "mixed";
      element.dataset.tone = tone;
    };

    // No próximo quadro: o tema novo já está aplicado no <html> (efeito do App roda depois).
    const frame = requestAnimationFrame(() => measure());
    // Entradas e mudanças de lugar animam por ~0,6s: mede de novo quando assentam.
    const settled = window.setTimeout(measure, 700);
    const observer = new ResizeObserver(() => measure());
    observer.observe(element);
    window.addEventListener("resize", measure);
    // O tema troca o filtro da foto: mede assim que o <html> mudar de tema.
    const themeWatch = new MutationObserver(() => measure());
    themeWatch.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    return () => {
      themeWatch.disconnect();
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(settled);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, backgroundId, theme]);
}
