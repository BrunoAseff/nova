import type { WidgetSize } from "@/content/widgets";

/**
 * Tamanho contínuo dos widgets. O palco põe em cada widget a variável `--k` (0 = S,
 * 1 = M, 2 = L) e, ao trocar de tamanho, anima o número entre os dois. Cada medida do
 * widget (fonte, largura, espaçamento, orbe) é interpolada a partir dela pelo `sized`,
 * então o layout de verdade vai de um tamanho ao outro: nada encolhe antes de crescer,
 * nada pula, e o texto não fica distorcido como numa escala.
 */
export const SIZE_STEP: Record<WidgetSize, number> = { s: 0, m: 1, l: 2 };

/** Medida que vale `s` em S, `m` em M e `l` em L, e passa em linha reta entre elas. */
export function sized(s: string, m: string, l: string): string {
  const toM = "clamp(0, var(--k, 1), 1)";
  const toL = "clamp(0, var(--k, 1) - 1, 1)";
  return `calc(${s} + (${m} - ${s}) * ${toM} + (${l} - ${m}) * ${toL})`;
}
