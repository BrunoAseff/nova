# Nova: roadmap da repaginada

Como funciona: quando o Bruno disser **"próximo"**, a gente começa a discutir o primeiro item com status `pendente`. Esse item passa para `em andamento`, e o anterior vai para `feito`. As decisões tomadas em cada item ficam anotadas logo abaixo dele.

Status: `pendente` · `em andamento` · `feito`

---

## 1. Fundação: nova stack, só frontend · `em andamento`

Recomeçar do zero, sem banco de dados e sem landing page (a raiz abre direto o app). Deploy na Cloudflare.

Plano detalhado: [01-fundacao.md](01-fundacao.md)

- Mover o código atual para uma pasta de referência (ex.: `legacy/`) e manter o mesmo `.git` e o mesmo remote.
- Escolher a stack nova. O Next.js deixa de fazer sentido sem backend (ex.: Vite + React, todas as dependências atualizadas).
- Definir o escopo sem backend. Saem Prisma, NextAuth, Resend, UploadThing, as rotas de API, as server actions, sign-in, verify-email e reset-password. Decidir o que acontece com a página de pricing e o plano "Supernova" (hoje existe só a migration `stripe`, sem nenhum código).
- Definir onde ficam os assets que hoje estão em `utfs.io` (UploadThing), já que essa conta deixa de existir.
- Decidir o que acontece com landing, termos e privacidade (sem conta, a política de privacidade fica bem mais simples).

## 2. Arquitetura de estado e persistência · `pendente`

Hoje a mesma informação é gravada em três lugares, à mão: `setState`, depois `localStorage`, depois a fila de changes.

- Uma única fonte de verdade, com persistência automática (ex.: store com middleware de persist), versionamento e migração de schema.
- Remover o contexto gigante (`SpaceContext`, com ~30 campos), o Zustand duplicado do som ambiente e o reducer e o store de ciclos que coexistem.
- Modelo de dados limpo e aninhado por widget, com espaços que não dependem de IDs fixos 1, 2 e 3.
- Preservar o progresso local de quem já usa (migrar as chaves antigas do localStorage, se fizer sentido).

## 3. Design: de "edgy/neon" para calmo de verdade · `pendente`

A proposta era clean, calma e tranquila. Na prática, a UI usa pretos muito escuros e cores neon (o `--primary` é um ciano a 100% de saturação), e o pomodoro tem cara de "gamer".

- Nova paleta (claro e escuro), tipografia e tokens.
- Repensar os componentes principais: pomodoro, relógio, sidebar e tabs.
- Reduzir a quantidade de fontes (hoje são 5: inter, open, montserrat, delius, countdown).

## 4. Imagens e ilustrações · `pendente`

- Dos 35 backgrounds, 26 são gerados por IA (`AIgenerated: true`). Trocar por fotos e ilustrações reais, de artistas e com licença clara.
- Rever as ilustrações SVG (features, 404, 500, temas) junto com o novo design.
- Organizar créditos e atribuições.

## 5. Sons · `pendente`

- Rever a qualidade dos sons ambiente; alguns são ruins.
- Corrigir a demora para começar a tocar: hoje vêm por streaming do `utfs.io`, com um `new Audio()` criado só no play, sem preload.
- **Causa principal, achada no setup:** os sons ambiente são WAV sem compressão, de 22MB a **459MB** (Rain tem 459MB, Ocean Waves 161MB; ~830MB no total). Um loop curto em Opus/AAC deve ficar abaixo de 1–2MB cada. Os originais estão em `media/legacy/ambient-sounds/`.
- Os alarmes são `.wav` de 0,25 a 1,5MB cada (4,6MB no total). Converter para um formato comprimido.
- Fazer loop sem "gap" no som ambiente.

## 6. Performance · `pendente`

- Carregamento dos backgrounds em tela cheia sem perder qualidade: formatos modernos, tamanhos responsivos, placeholder real por imagem (hoje todas usam o mesmo `blurBackground.png`) e pré-carregamento dos espaços vizinhos.
- Reduzir o `public/` de 20MB (vídeo da landing, wavs, etc.).
- Tamanho do bundle: há 4 libs de ícones (lucide, phosphor-react, @phosphor-icons, tabler/react-icons) mais ~25 ícones próprios, e `framer-motion` e `motion` instalados ao mesmo tempo.
- Revisar re-renders (o contexto gigante atual re-renderiza tudo).

## 7. Logo nova · `pendente`

A logo atual (`public/logo.svg`) será descartada. É uma identidade nova do zero, feita mais para o final, quando paleta, tipografia e ícones (item 3) já estiverem definidos.

- Logo, favicon, ícones do app (PWA, se entrar no item 6) e imagem de compartilhamento (Open Graph).
- Trocar `public/logo.svg` e as referências no `index.html`.

## 8. Limpeza e qualidade · `pendente`

- Dependências mortas ou usadas uma única vez (axios, immer, ts-prune…).
- Restos de debug: `console.log`, `public/test.svg`, migration `test`, origem de Codespaces no `next.config.js`.
- Lint, format e CI atualizados para a nova stack.
- README e prints novos para o portfólio.
