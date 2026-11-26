# 1. Fundação: plano de setup

Status: **aprovado em 26/11/2026; setup local feito, falta a parte da Cloudflare** (ver "Andamento" no fim)

Premissas:

- O app é só frontend, sem banco de dados e sem contas.
- Não há mais landing page: a raiz `/` já abre o app.
- O deploy vai para a Cloudflare.
- Critério para cada dependência: só entra o que tem um uso claro agora. Qualquer outra coisa espera o item do roadmap em que ela fizer falta.

Versões consultadas no npm em 26/11/2026. No momento do setup, instalar a última versão estável de cada uma.

---

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Runtime / gerenciador | Node 26 LTS, pnpm 12 | O Node 26 virou LTS em outubro de 2026. O pnpm já era usado no projeto. Fixar as versões em `engines` e `packageManager`: o Node 25+ não traz mais o corepack, e o pnpm passa a trocar de versão sozinho. |
| Build / dev server | Vite 8 | Sem backend, sem SSR e com uma tela só, o Next vira peso morto (server actions, rotas de API, runtime de servidor). O Vite gera arquivos estáticos puros, o dev server é instantâneo e o Vite 8 já usa Rolldown, que tem builds muito rápidos. |
| UI | React 19 | Dá para reaproveitar a lógica e os componentes do código antigo como referência, e é a stack que você domina. Trocar de framework (Svelte, Solid) não resolve nenhum dos problemas do roadmap. |
| Re-render | React Compiler (via `@rolldown/plugin-babel`) | Memoiza automaticamente. Ataca direto a lentidão de re-renders que o contexto gigante causava, sem `useMemo`/`useCallback` à mão. |
| Linguagem | TypeScript 7 (o compilador nativo) com `strict` e `noUncheckedIndexedAccess` | O typecheck fica cerca de 10x mais rápido. As flags estritas pegam bugs de estado e de `localStorage` (ex.: acesso a índice inexistente). |
| Estilo | Tailwind CSS 4 (`@tailwindcss/vite`) + CSS modules do Arc | Tailwind para o layout e os widgets que a gente escreve; os componentes do Arc mantêm os próprios CSS modules. Para não ter dois sistemas de cor, há **uma fonte de tokens só**: as variáveis CSS do `foundation.css` do Arc (paleta em `oklch`, superfícies, controles), que o `@theme` do Tailwind passa a referenciar. Mudar a paleta no item 3 muda os dois lados ao mesmo tempo. |
| Componentes | **Arc UI** (uiarc.dev, plano grátis, MIT), instalado pelo registry do shadcn | É feito para interfaces visuais: cada componente já vem com microinterações em Motion, tokens de movimento calmos (sem overshoot) e respeito a `prefers-reduced-motion`. O código vai para dentro do repositório (`components/arc/`) e a gente edita o que precisar. Arc usa Radix por baixo, então a decisão Base UI vs Radix deixa de existir. O shadcn/ui puro só entra se faltar algum componente no Arc. |
| Estado | Zustand 5 + middleware `persist` | Uma fonte de verdade que grava no `localStorage` sozinha. Elimina o `setState` + `localStorage` + fila de changes atual, e você já conhece a lib. O desenho dos stores fica para o item 2. |
| Animação | Motion (motion.dev) | O Arc já depende dele e traz `motionTokens` (durações, easings e springs) que os nossos widgets vão reaproveitar, então tudo se move do mesmo jeito. Cobre o que o Nova precisa: transições de layout, `AnimatePresence`, springs, gestos e animação de SVG (respiração, timer). O anime.js seria uma segunda lib para o mesmo trabalho; só entra se aparecer um efeito específico de timeline/SVG que o Motion não resolva bem. |
| Ícones | **Biblioteca própria** gerada com a skill `generate-icons` (MIT) | Gera um conjunto original desenhado a partir dos nossos tokens, com amostra aprovada antes do conjunto inteiro, e entrega componentes React tree-shakeable. Combina com o objetivo de ter uma identidade própria. Roda no **item 3**, depois que paleta e tipografia estiverem definidas, porque ela lê o design system. Até lá, o único ícone no projeto é o `lucide-react` que os componentes do Arc trazem; depois trocamos esses também. Phosphor sai do plano. |
| Fontes | Fontsource (self-hosted) | A fonte vai junto no bundle, com hash e cache. Não há requisição para o Google, o que é melhor para performance e privacidade. Quais fontes, decidimos no item 3. |
| Lint + format | Biome 2 | Uma ferramenta só, no lugar de ESLint, Prettier e plugins. Tem regras de hooks e ordenação de classes Tailwind. O ESLint aqui seria um problema: o `typescript-eslint` ainda não suporta o TS 7. |
| Testes | Vitest 5 | Só para a lógica que pode quebrar sem ninguém ver: timer do pomodoro, ciclos e migração de dados persistidos. Sem E2E por enquanto, porque é um app de uma tela. |
| Roteamento | Nenhum | Sem landing e sem auth sobra uma única tela. Coisas como "sobre" e "créditos" viram diálogos dentro do app. |
| Tema claro/escuro | Feito à mão (classe no `<html>` + store) | É umas 20 linhas. Não precisa do `next-themes`. |
| Analytics | Cloudflare Web Analytics | Grátis, sem cookies e sem banner de consentimento. Substitui o Vercel Analytics e o Speed Insights. |

### O que sai de vez

Next.js, Prisma/Postgres, NextAuth, bcrypt, Resend/react-email, UploadThing, t3-env, axios, immer, next-themes, Vercel Analytics, `framer-motion` (duplicada), `phosphor-react`, `@phosphor-icons/react`, `@tabler/icons-react`, `react-icons`, os ~25 ícones SVG feitos à mão, `cmdk`, `react-dropzone`, `embla-carousel`, `react-hook-form` (ainda vamos confirmar se algum formulário precisa dele), ESLint, Prettier e ts-prune.

### O que fica para itens futuros (de propósito)

- **Zod** (validar dados persistidos e migrar versões): decidir no item 2.
- **PWA** (`vite-plugin-pwa`, cache offline de sons e imagens, instalar como app): decidir no item 6. Combina muito com o uso de "segunda tela".
- **Otimização de imagens** (gerar AVIF/WebP no build ou usar Cloudflare Images): decidir no item 6.
- **Biblioteca de ícones própria** (`generate-icons`): item 3.
- **anime.js**: só se o Motion não der conta de algum efeito.
- **Fundo enviado pelo usuário** (guardado localmente via IndexedDB): é uma possível feature nova, depois.

---

## Componentes do Arc que encaixam no Nova (todos do plano grátis)

| Onde | Componentes |
|---|---|
| Pomodoro | Segmented control (foco / pausa curta / pausa longa), Slot text ou Countdown (dígitos animados), Number field ou Scrub input (durações) |
| Som ambiente | Slider ou Elastic slider (volume), Radio cards (escolha do som) |
| Configurações | Drawer ou Bottom sheet (mobile), Dialog, Switch, Select, Tabs, Tooltip, Popover, Theme switcher |
| Lembretes | Reorderable list, Inline edit, Swipe actions, Toast |
| Atalhos e reset | Shortcut recorder, Hold to confirm (no lugar do diálogo de "tem certeza?") |
| Citações e textos | Text reveal, Text morph |

O plano Pro do Arc não é necessário. Se algum dia fizer falta, a licença individual cobre projetos pessoais.

---

## Docker: não usar

- Não há serviço para orquestrar. O Docker fazia sentido no projeto antigo por causa do Postgres (`start-database.sh`). Sem banco, o dev é só `pnpm dev`.
- Atrapalha o desenvolvimento: HMR e file watching via volume ficam mais lentos e instáveis, principalmente em Mac e Windows.
- A Cloudflare não usa containers para servir arquivos estáticos, então a imagem não seria usada em lugar nenhum.
- A reprodutibilidade já está garantida: Node e pnpm com versões fixas, mais o `pnpm-lock.yaml`, dão o mesmo resultado em qualquer máquina e no CI.

Voltaria a fazer sentido se o projeto ganhasse um backend com serviços (banco, fila).

---

## Infra na Cloudflare

- **App:** Cloudflare Workers com Static Assets. Para projetos novos, a Cloudflare recomenda isso no lugar do Pages. Um `wrangler.jsonc` aponta para o `dist/`, sem nenhum código de Worker, então o app continua 100% estático.
- **Deploy:** Workers Builds, conectado ao repositório do GitHub. Cada branch ou PR ganha uma URL de preview e o `main` vai para produção. Não é preciso guardar token da Cloudflare no GitHub.
- **Mídia (fundos e sons):** um bucket R2 com domínio próprio (ex.: `assets.<domínio>`). Isso mantém binários pesados fora do git e entrega pelo CDN com cache longo. O R2 não cobra egress.
- **Domínio:** a definir. Fica na Cloudflare, e a virada do domínio antigo acontece no fim do roadmap.

---

## CI (GitHub Actions)

Um workflow em push e PR que roda `biome ci`, o typecheck (`tsc --noEmit`, TS 7), `vitest run` e `vite build`. O deploy fica com o Workers Builds, não com o Actions.

---

## Estrutura de pastas

```
src/
  app/            App.tsx, layout da tela, providers
  features/       uma pasta por widget: clock/, pomodoro/, quote/, breathing/,
                  reminders/, ambient-sound/, background/, spaces/
  components/ui/  componentes shadcn
  stores/         stores Zustand (o desenho fica para o item 2)
  content/        dados estáticos: fundos, sons, citações
  lib/            utilitários
  styles/         CSS global + tokens (@theme)
```

---

## Passo a passo de execução

1. **Preservar o v1**
   - Criar a tag `v1-legacy` no `main` atual: o histórico completo fica guardado para sempre.
   - Criar a branch `v2` para todo o trabalho novo. O `main` continua servindo o app antigo até a virada.
   - Baixar **agora** todos os arquivos que hoje estão no `utfs.io` (fundos e sons), antes de desligar a conta do UploadThing.
   - Mover o código antigo para `legacy/` e colocar essa pasta no `.gitignore`. Ela é só uma referência local; não entra no lint, no build nem no repositório, já que a tag guarda tudo.

2. **Scaffold**
   - Vite + React + TS com pnpm, `engines` e `packageManager` fixados, mais um `.nvmrc`.

3. **Ferramentas**
   - TS estrito com alias `@/`, React Compiler, Tailwind 4, Biome e Vitest.
   - `shadcn init`, registry `@uiarc` no `components.json`, `arc-foundation` instalado e os tokens ligados ao `@theme` do Tailwind.
   - Instalar só os componentes do Arc que o esqueleto usa. Os demais entram conforme cada widget for reconstruído.
   - Instalar a skill `generate-icons` no projeto (`.claude/skills/`), para usar no item 3.

4. **Esqueleto do app**
   - Uma tela com o fundo em tela cheia e o toggle de tema, só para validar o pipeline de ponta a ponta. As features vêm nos próximos itens.

5. **Cloudflare**
   - Configurar o `wrangler.jsonc`.
   - Criar o bucket R2 com domínio e subir a mídia baixada.
   - Conectar o Workers Builds e validar a URL de preview.

6. **CI**
   - Adicionar o workflow novo e apagar o `lint.yaml` antigo.

7. **Docs**
   - README novo (curto) e `ai-context` atualizado.

### Virada (no fim do roadmap, não agora)

- Fazer o merge de `v2` em `main` e apontar o domínio para a Cloudflare.
- Desligar o projeto na Vercel.
- Apagar o banco, o app do UploadThing, a conta do Resend e as credenciais OAuth do Google.
- Os dados de quem tinha conta somem junto com o banco. O que estiver no `localStorage` do mesmo domínio pode ser migrado no item 2.

---

## Decisões

- [x] Biome (aprovado junto com o plano).
- [ ] Qual domínio usar (o atual ou um novo)?

---

## Andamento

### Feito (26/11/2026)

- Tag `v1-legacy` criada no `main` (atualizado com o `origin/main`). **Ainda só local**: falta dar push.
- Branch `v2` criada. O código antigo está em `legacy/`, que fica no `.gitignore`.
- Mídia do `utfs.io` baixada para `media/legacy/` (35 fundos e 8 sons), com `manifest.json` que liga cada URL antiga ao arquivo. A pasta fica no `.gitignore`.
- Scaffold e ferramentas: Vite 8, React 19 + React Compiler (Babel), TS 7, Tailwind 4, Biome, Vitest e Zustand.
- Arc: `components.json` com o registry `@uiarc`, mais `arc-foundation`, `button` e `theme-switch` instalados em `src/components/arc/`. Os tokens do Arc estão ligados ao `@theme` do Tailwind em `src/styles/globals.css`.
- Esqueleto: fundo em tela cheia e troca de tema (store persistido, tema aplicado antes da primeira pintura, View Transition). Verificado no navegador.
- `wrangler.jsonc` validado com `wrangler deploy --dry-run`. Há um `_headers` com cache imutável para `/assets/*`.
- CI em `.github/workflows/ci.yml` (lint, typecheck, testes e build). O `lint.yaml` antigo saiu.
- Skill `generate-icons` instalada em `.claude/skills/generate-icons/`.
- README novo, `.env.example` e `.claude/launch.json` (dev server).

### Desvios do plano

- `exactOptionalPropertyTypes` ficou de fora: quebra os componentes do Arc (Motion). As flags `strict` e `noUncheckedIndexedAccess` continuam.
- O script que roda tudo do CI se chama `pnpm check`, porque `pnpm ci` é um comando do próprio pnpm.
- Em dev, um plugin do Vite serve `media/` em `/media` no lugar do R2. Em produção, a base vem de `VITE_ASSETS_URL`.
- Lint e format ignoram `src/components/arc/` (código do Arc), `ai-context/` e `.claude/`.

### Falta (depende do Bruno)

- `wrangler login`: o token local expirou.
- Criar o bucket R2 e subir os fundos (13MB). Os WAVs ambiente (~830MB) **não** devem subir; o item 5 vai trocá-los por versões comprimidas.
- Conectar o Workers Builds ao repositório no painel da Cloudflare e validar a URL de preview da `v2`.
- Definir o domínio.
- Push da tag `v1-legacy` e da branch `v2`.

### Anotado para itens futuros

- O bundle JS está em 397KB (129KB gzip), quase todo de Motion e Lucide. Avaliar `LazyMotion` no item 6.
