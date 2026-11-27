import { create } from "zustand";

/**
 * Estado de atenção (runtime, nunca persistido). Ver fundamentos de design, seção 5.
 * - rest: ninguém mexe. Só cena, ambiente e instrumentos recolhidos.
 * - active: mouse, teclado ou toque recentes. Controles e instrumentos completos.
 * - configuring: um painel está aberto, ou o palco está sendo arranjado.
 */
export type Attention = "rest" | "active" | "configuring";

interface AttentionState {
  attention: Attention;
  panelOpen: boolean;
  /** Modo de arranjar: os widgets viram arrastáveis sobre uma grade. */
  arranging: boolean;
  setAttention: (attention: Exclude<Attention, "configuring">) => void;
  setPanelOpen: (open: boolean) => void;
  setArranging: (arranging: boolean) => void;
}

export const useAttentionStore = create<AttentionState>()((set) => ({
  attention: "active",
  panelOpen: false,
  arranging: false,
  setAttention: (attention) => set((s) => (s.panelOpen || s.arranging ? s : { attention })),
  setPanelOpen: (panelOpen) =>
    set((s) => ({
      panelOpen,
      attention: panelOpen || s.arranging ? "configuring" : "active",
    })),
  setArranging: (arranging) =>
    set((s) => ({
      arranging,
      attention: arranging || s.panelOpen ? "configuring" : "active",
    })),
}));

// Em dev, editar um store recarrega a página: o HMR criaria uma segunda cópia do store
// e partes do app continuariam ligadas à antiga.
import.meta.hot?.accept(() => window.location.reload());
