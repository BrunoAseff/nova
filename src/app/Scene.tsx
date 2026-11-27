import { useEffect, useState } from "react";
import { type Background, getBackground } from "@/content/backgrounds";
import { useActiveSpace } from "@/stores/spaces";

/** Duração do crossfade (igual à transição de opacidade de `.scene-image`) mais folga. */
const SETTLE_FALLBACK_MS = 2000;

/**
 * Fases da troca de fundo:
 * - settled: uma foto só, inteira na tela.
 * - loading: a foto nova está carregando, invisível, por cima da base.
 * - fading: a foto nova carregou e está entrando por cima da base.
 */
type Phase = "settled" | "loading" | "fading";

/**
 * L0 · Cena. A foto, o filtro da atmosfera (escurecer à noite, dessaturar na Noite) e o
 * scrim localizado: gradientes só onde há texto, não um véu sobre a imagem inteira.
 *
 * Trocar de fundo é um crossfade lento: a foto nova só começa a aparecer quando já
 * carregou, por cima da base. Só vira base uma foto que terminou de entrar; trocando
 * rápido várias vezes, a de baixo continua sendo uma foto inteira e a cena nunca fica
 * vazia.
 */
export function Scene() {
  const background = getBackground(useActiveSpace().backgroundId);
  const [shown, setShown] = useState<Background>(background);
  const [base, setBase] = useState<Background | null>(null);
  const [phase, setPhase] = useState<Phase>("settled");

  if (background.id !== shown.id) {
    const nextBase = phase === "settled" ? shown : base;
    setShown(background);
    if (nextBase?.id === background.id) {
      // Voltou para a foto que está embaixo: ela já está inteira na tela.
      setBase(null);
      setPhase("settled");
    } else {
      setBase(nextBase);
      setPhase("loading");
    }
  }

  const settle = () => {
    setBase(null);
    setPhase("settled");
  };

  // Se o transitionend não vier (aba em segundo plano, movimento reduzido), assenta igual.
  useEffect(() => {
    if (phase !== "fading") return;
    const timer = window.setTimeout(settle, SETTLE_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  });

  const layers = base ? [base, shown] : [shown];

  return (
    <div className="scene absolute inset-0 overflow-hidden" aria-hidden="true">
      {layers.map((layer) => {
        const top = layer.id === shown.id;
        return (
          <img
            key={layer.id}
            src={layer.url}
            alt=""
            data-hidden={top && base !== null && phase === "loading"}
            className="scene-image absolute inset-0 size-full object-cover"
            fetchPriority={top ? "high" : "auto"}
            decoding="async"
            onLoad={
              top
                ? () => setPhase((p) => (p === "loading" ? (base ? "fading" : "settled") : p))
                : undefined
            }
            onTransitionEnd={
              top
                ? (event) => {
                    if (event.propertyName === "opacity") settle();
                  }
                : undefined
            }
          />
        );
      })}
      <div className="scene-scrim absolute inset-0" />
    </div>
  );
}
