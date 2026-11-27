import { motion } from "motion/react";
import { type ReactNode, useState } from "react";
import { reveal } from "@/lib/motion";

/**
 * Conteúdo que abre e fecha animando a altura. Corta o que passa da borda só enquanto
 * anima: parado, o overflow fica visível e anéis de foco e sombras não são cortados.
 * Usar dentro de `AnimatePresence`.
 */
export function Reveal({
  children,
  className,
  clip = true,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Cortar enquanto anima. Em listas, sim (uma linha não invade a outra). Sem nada
   * embaixo, `false`: o conteúdo esmaece inteiro no lugar enquanto o espaço abre.
   */
  clip?: boolean;
}) {
  // Começa sem cortar: com `AnimatePresence initial={false}` não há animação de entrada,
  // e o corte ficaria ligado para sempre (era o que cortava o canto das linhas).
  const [animating, setAnimating] = useState(false);
  return (
    <motion.div
      {...reveal}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
      // Só na vertical (`clip` permite um eixo de cada jeito): dos lados nada é cortado.
      style={{ overflowY: clip && animating ? "clip" : "visible" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
