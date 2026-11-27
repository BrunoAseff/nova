import { useEffect, useState } from "react";

/** Data atual, atualizada na virada de cada minuto (ou do intervalo pedido). */
export function useNow(stepMs = 60_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: number;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timer = window.setTimeout(tick, stepMs - (current.getTime() % stepMs) + 20);
    };
    timer = window.setTimeout(tick, stepMs - (Date.now() % stepMs) + 20);
    return () => window.clearTimeout(timer);
  }, [stepMs]);

  return now;
}
