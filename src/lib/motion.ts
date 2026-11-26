import type { Transition } from "motion/react";

/**
 * Movimento do Nova (P5: lento, com propósito, sem overshoot).
 * Tudo que aparece ou some passa por aqui, para o app inteiro se mover do mesmo jeito.
 */
export const ease = {
  /** Entradas e mudanças de estado: começa rápido e pousa devagar. */
  out: [0.22, 1, 0.36, 1],
  /** Elementos que já estão na tela e mudam de lugar. */
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  /** Hover, pressionar, toggles. */
  quick: 0.18,
  /** Painéis, popovers, conteúdo que entra. */
  base: 0.32,
  /** Camadas inteiras (dock aparecendo, troca de espaço). */
  calm: 0.6,
} as const;

/** Mola sem quique, para indicadores que deslizam (aba ativa, toggle). */
export const glide: Transition = { type: "spring", stiffness: 420, damping: 40, mass: 0.9 };

export const enter: Transition = { duration: duration.base, ease: ease.out };
export const calm: Transition = { duration: duration.calm, ease: ease.out };

/** Conteúdo que aparece dentro de um painel: altura, opacidade e um leve desfoque. */
export const reveal = {
  initial: { opacity: 0, height: 0, filter: "blur(4px)" },
  animate: { opacity: 1, height: "auto", filter: "blur(0px)" },
  exit: { opacity: 0, height: 0, filter: "blur(4px)" },
  transition: enter,
} as const;
