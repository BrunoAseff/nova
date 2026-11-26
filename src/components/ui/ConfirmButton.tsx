import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { duration, ease } from "@/lib/motion";
import { Button, type ButtonProps } from "./Button";

interface ConfirmButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** O que o botão mostra antes de pedir confirmação (ex.: um ícone). */
  children: ReactNode;
  /** Texto do segundo passo, ex.: "Reset?" ou "Delete". */
  confirmLabel: string;
  onConfirm: () => void;
}

/**
 * Ação destrutiva em dois toques, sem diálogo que quebre o clima: o primeiro toque
 * transforma o botão no pedido de confirmação; se nada acontecer em 3s, ele volta.
 */
export function ConfirmButton({
  children,
  confirmLabel,
  onConfirm,
  icon,
  variant = "secondary",
  ...props
}: ConfirmButtonProps) {
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!asking) return;
    const timer = window.setTimeout(() => setAsking(false), 3000);
    return () => window.clearTimeout(timer);
  }, [asking]);

  return (
    <Button
      layout
      transition={{ layout: { duration: duration.base, ease: ease.out } }}
      variant={asking ? "danger" : variant}
      icon={asking ? false : icon}
      onClick={() => {
        if (asking) {
          setAsking(false);
          onConfirm();
        } else setAsking(true);
      }}
      onBlur={() => setAsking(false)}
      data-asking={asking}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={asking ? "ask" : "idle"}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: duration.quick }}
          className="flex items-center gap-2"
        >
          {asking ? confirmLabel : children}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
