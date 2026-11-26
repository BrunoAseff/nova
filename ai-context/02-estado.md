# 2. Arquitetura de estado e persistência

Status: **feito em 26/11/2026** (ver "Implementação" no fim)

## O que existe no v1 (e por que dói)

| Problema | Onde | Efeito |
|---|---|---|
| A mesma informação gravada em 3 lugares, à mão | `SpaceContext`: `setState` → `updateXLocalStorage` → `updateXLocalStorageChanges` | É fácil esquecer um dos três. O estado na tela e o salvo divergem. |
| Contexto gigante (~30 campos e funções) | `spaceContext.tsx` | Qualquer mudança re-renderiza tudo o que consome o contexto. |
| Três padrões de estado ao mesmo tempo | Context + Zustand (`useCycleStore`, `useAmbientSound`) + reducer (`cycleReducer`) | O som ambiente existe no contexto e no store; os ciclos existem no reducer e no store. |
| JSX dentro do estado | `Space.icon: JSX.Element` | Não dá para serializar, então os ícones eram recriados à mão na hora de carregar. |
| URL dentro do estado | `background` e `ambientSound` guardam a URL do `utfs.io` | Quando o arquivo muda de lugar, o dado salvo quebra. |
| Espaços com ID numérico fixo | `id: 1, 2, 3` + `clientId` no banco | Não suporta criar, remover ou reordenar espaços. |
| Timer contando ticks | `setInterval` de 100ms somando `amountSecondsPassed` | Atrasa (drift) e para quando a aba fica em segundo plano, porque o navegador limita timers. |
| Dados persistidos sem validação nem versão | `JSON.parse` direto do `localStorage` | Um dado antigo ou corrompido quebra o app inteiro. |
| Chaves soltas no `localStorage` | `spaces`, `shortcut`, `ambientSound`, `reminderMessages`, `pomodoro-storage`... | Não há prefixo, versão nem migração. |

---

## Proposta

### Princípios

1. **Uma fonte de verdade por dado.** O componente lê do store e chama uma ação; a persistência acontece sozinha (`persist` do Zustand).
2. **Estado guarda dados, não apresentação.** Nada de JSX nem URL: só IDs (`backgroundId: "river-path"`, `icon: "home"`), resolvidos pelo catálogo em `src/content/`.
3. **Três tipos de estado, tratados de forma diferente:**
   - **Preferências** (persistidas para sempre): espaços, widgets, lembretes, som escolhido, volume, tema.
   - **Sessão** (persistida, mas descartável): o pomodoro em andamento. Sobrevive a um reload.
   - **Runtime** (nunca persiste): áudio tocando, alarme soando, painel aberto. O navegador bloqueia autoplay mesmo, então persistir "tocando" não serve para nada.
4. **Objetos de áudio fora do estado.** O `HTMLAudioElement` vira um módulo (`lib/audio`) que reage ao store. O store guarda só "qual som, volume, tocando ou não".
5. **Lógica pura separada do store.** Regras do pomodoro (fases, ciclos, pausas) viram funções puras testadas com Vitest. O store só chama essas funções.

### Stores (Zustand, um por domínio, sem Context)

| Store | Chave no `localStorage` | Conteúdo |
|---|---|---|
| `usePreferencesStore` | `nova:preferences` | Tema e o atalho fixado. Substitui o `theme.ts` atual. |
| `useSpacesStore` | `nova:spaces` | Lista de espaços (com os widgets de cada um), ordem e espaço ativo. |
| `useRemindersStore` | `nova:reminders` | Lembretes do usuário (texto + tipo). |
| `useAmbientStore` | `nova:ambient` | Som escolhido e volume (persistidos), mais `isPlaying` (runtime, fora do `partialize`). |
| `usePomodoroStore` | `nova:pomodoro` | Sessão em andamento: fase, status, `endsAt`, ciclo atual, tarefa. |

Os componentes leem com seletores (`useSpacesStore(s => s.activeSpace().clock)`), então cada widget só re-renderiza quando o seu pedaço muda. O React Compiler cuida do resto.

### Modelo de dados

```ts
type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

interface Space {
  id: string;            // "home", "focus", "relax" para os padrões; UUID para os novos
  name: string;
  icon: IconId;          // chave do catálogo de ícones (item 3), não JSX
  backgroundId: string;  // chave do catálogo de fundos, não URL
  widgets: {
    clock:     { visible: boolean; position: Position; format: "12h" | "24h" };
    pomodoro:  { visible: boolean; focusMin: number; shortBreakMin: number; longBreakMin: number;
                 autoStart: boolean; alarm: { enabled: boolean; soundId: string; repeat: number } };
    quote:     { visible: boolean; position: Position };
    breathing: { visible: boolean; technique: "box" | "4-7-8" | "alternate-nostril" | "wim-hof" };
    reminders: { visible: boolean; position: Position };
  };
}
```

- Os padrões vêm de uma função `createDefaultSpaces()`, e não de um objeto mutável compartilhado.
- O "resetar tudo" volta para esses padrões.

### Pomodoro baseado em horário, não em ticks

- Ao iniciar, o store guarda `endsAt = Date.now() + duração`. Pausar guarda `remainingMs`; retomar recalcula `endsAt`.
- O tempo na tela é **derivado** (`endsAt - agora`). Um hook só re-renderiza o display uma vez por segundo, alinhado ao relógio.
- Resolve três problemas do v1:
  - acaba o drift;
  - acaba o atraso em aba de fundo;
  - um reload no meio do foco continua de onde parou.
- Quando a fase termina, um `setTimeout` único até `endsAt` toca o alarme e avança a fase (ou espera, se `autoStart` estiver desligado). Ao voltar para a aba, o estado é recalculado pelo horário.
- Regras puras em `features/pomodoro/machine.ts`: `start`, `pause`, `resume`, `skip`, `reset` e `advance(now)`, todas cobertas por testes.

### Persistência

- `persist` do Zustand com `name` prefixado (`nova:*`), `version` e `migrate` em cada store.
- **Validação com Zod 4 (`zod/mini`, mais leve)** ao reidratar. Cada campo tem um `.catch(default)`: se um fundo salvo deixou de existir, ou se um dado vier corrompido, cai no padrão só daquele campo, em vez de quebrar o app. Para isso o Zod entra agora; antes ele estava como "decidir no item 2".
- `partialize` deixa o runtime (`isPlaying`, alarme) fora do que é salvo.
- **Sincronização entre abas:** um listener de `storage` reidrata o store quando outra aba muda os dados. Combina com o uso como segunda tela, porque duas abas abertas mostram o mesmo timer e as mesmas configurações.
- O script anti-flash de tema no `index.html` passa a ler `nova:preferences`.

### Estrutura

```
src/
  stores/              preferences.ts, spaces.ts, reminders.ts, ambient.ts, pomodoro.ts
  stores/lib/          helper createPersistedStore (persist + zod + sync entre abas)
  features/pomodoro/   machine.ts (+ testes), widget
  lib/audio/           motor de áudio (ambiente com loop/crossfade, alarme)
  content/             catálogos estáticos: fundos, sons, citações, técnicas de respiração
```

### Testes (Vitest)

- A máquina do pomodoro: todas as transições, ciclo longo a cada 4, pausa, skip e reload no meio de uma fase.
- As migrações e a validação: dado antigo, dado corrompido, ID inexistente.
- Os stores: ações principais e o `partialize`.

---

## Decisões (26/11/2026)

1. **Não migrar nada do v1.** Não há usuários ativos, o domínio antigo foi descontinuado e a URL da Vercel só o Bruno usa. As chaves antigas do `localStorage` são ignoradas. O `migrate` dos stores existe só para versões futuras da v2.
2. **Som ambiente global**, como no v1: um som só, que continua tocando ao trocar de espaço. Fica no `useAmbientStore`, fora do modelo de `Space`.
3. **Espaços criados pelo usuário.** Começa com Home, Focus e Relax, e a pessoa pode criar, renomear, reordenar e apagar, com limite de 8 espaços e no mínimo 1. Apagar o espaço ativo passa para o vizinho. A UI disso é desenhada no item 3; o store já nasce com as ações.

## Fora do escopo deste item

- O visual de cada widget: item 3.
- Catálogo e arquivos de fundos e sons: itens 4 e 5.
- Exportar/importar configurações (backup em JSON, já que não há conta). Com os schemas Zod prontos fica barato; pode virar uma feature depois.

---

## Implementação (26/11/2026)

### O que existe

| Arquivo | O quê |
|---|---|
| `src/stores/lib/persisted.ts` | `persistOptions` (chave `nova:*`, versão, validação Zod no `merge`, `repair` opcional) e `syncAcrossTabs`. |
| `src/stores/preferences.ts` | Tema e widget fixado. Substitui o antigo `stores/theme.ts`; o `applyTheme` foi para `src/lib/theme.ts`. |
| `src/stores/spaces.ts` | Espaços e widgets, com criar, renomear, ícone, fundo, apagar, reordenar, `updateWidget` e reset. Também `useActiveSpace`/`selectActiveSpace`. |
| `src/stores/reminders.ts` | Lembretes (máximo de 50, até 280 caracteres cada). |
| `src/stores/ambient.ts` | Som e volume (persistidos) e `isPlaying` (runtime). |
| `src/stores/pomodoro.ts` | Sessão global e ações. A config vem do espaço ativo no `start` e fica guardada na sessão. |
| `src/features/pomodoro/machine.ts` | Regras puras: `start`, `pause`, `resume`, `skip`, `reset`, `advance` e `remainingMs`. |
| `src/features/pomodoro/hooks.ts` | `usePomodoroScheduler` (montado no App: um timeout até `endsAt` e recálculo ao voltar para a aba) e `useRemainingMs` (re-render a cada segundo, alinhado ao timer). |
| `src/lib/audio/ambient.ts` | Motor do som ambiente, que reage ao store. Iniciado no `main.tsx`. |
| `src/lib/audio/alarm.ts` | Alarme que toca N vezes. Com várias abas abertas, só uma toca (Web Locks). |
| `src/content/*` | Catálogos com IDs estáveis: fundos, sons (ambiente e alarme), técnicas de respiração, tipos de lembrete, ícones de espaço, widgets e posições. |

### Detalhes que valem saber

- **Os padrões saem do schema.** Como todo campo tem `z.catch`, validar `{}` devolve o padrão (`defaultsOf`), então não há uma segunda lista de padrões para manter em sincronia.
- **Dado reparado só é regravado na próxima mudança.** A reidratação corrige em memória, mas não escreve de volta no `localStorage` (é o comportamento do `persist`). Isso não causa problema: a próxima ação grava o estado já corrigido.
- **Os sons ainda não têm `src`.** Os catálogos têm os IDs, mas os arquivos chegam no item 5. Até lá o motor não toca, e `isPlaying` volta para `false` em vez de fingir que está tocando.
- **Pomodoro com várias abas:** as duas abas calculam a mesma transição (é determinística, a partir de `endsAt`) e gravam o mesmo estado. O alarme toca em uma só.
- **Bundle:** Zod mini e os stores somaram ~10KB gzip (de 129KB para 139KB).

### Testes

32 testes em 4 arquivos:
- a máquina do pomodoro (transições, pausa longa a cada 4, autoStart depois de dormir, config guardada);
- os stores (ações e limites);
- a reidratação (campo inválido, dado lixo, lista vazia, IDs repetidos, sessão inválida).
