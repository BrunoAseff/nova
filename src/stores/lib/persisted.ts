import { type ZodMiniType, z } from "zod/mini";
import type { StoreApi, UseBoundStore } from "zustand";
import { createJSONStorage, type PersistOptions } from "zustand/middleware";

const PREFIX = "nova:";

export function storageKey(name: string) {
  return `${PREFIX}${name}`;
}

/**
 * Opções de `persist` padronizadas para todos os stores do Nova:
 * - chave com prefixo `nova:` e versão;
 * - só o que o `schema` descreve é salvo (o runtime fica de fora);
 * - ao reidratar, o dado salvo passa pelo `schema`. Campos inválidos caem no padrão
 *   (cada campo do schema tem seu `z.catch`), em vez de quebrar o app.
 */
export function persistOptions<State, Persisted extends object>(options: {
  name: string;
  version: number;
  schema: ZodMiniType<Persisted>;
  partialize: (state: State) => Persisted;
  /** Ajustes que dependem de mais de um campo, depois da validação. */
  repair?: (persisted: Persisted) => Persisted;
}): PersistOptions<State, Persisted> {
  const { name, version, schema, partialize, repair = (p) => p } = options;

  return {
    name: storageKey(name),
    version,
    storage: createJSONStorage(() => localStorage),
    partialize,
    // Não há versões anteriores da v2 ainda. Quando o formato mudar, a migração entra aqui;
    // até lá, um dado de outra versão passa pela validação e o que não servir cai no padrão.
    migrate: (persisted) => persisted as Persisted,
    merge: (persisted, current) => {
      const result = z.safeParse(schema, persisted);
      if (!result.success) return current;
      return { ...current, ...repair(result.data) };
    },
  };
}

type PersistedStore = UseBoundStore<StoreApi<unknown>> & {
  persist: { getOptions: () => { name?: string }; rehydrate: () => Promise<void> | void };
};

/**
 * Mantém abas abertas em sincronia: quando outra aba grava o store, esta reidrata.
 * O evento `storage` só dispara nas outras abas, então não há loop.
 */
export function syncAcrossTabs(store: PersistedStore) {
  if (typeof window === "undefined") return;
  const key = store.persist.getOptions().name;

  window.addEventListener("storage", (event) => {
    if (event.storageArea === localStorage && event.key === key) {
      void store.persist.rehydrate();
    }
  });
}
