# 3b. Protótipo: segunda versão (26/11/2026)

A primeira versão (seção 9 de `03a`) foi reprovada pelo Bruno, com razão: lixeiras vermelhas, botões grudados e tortos, card dentro de card, scrollbar quebrada, claro ilegível, campos surgindo sem animação, animações travadas, nada com alma.

Este documento registra **o que deu errado, por quê, o padrão de qualidade adotado e o que mudou**.

## Diagnóstico (problema → causa)

| O que se via | Causa real |
|---|---|
| "Delete Home / Delete Focus..." em vermelho em toda linha | Ação destrutiva com o mesmo peso da ação principal, sempre visível. Usei o `HoldToConfirm` do Arc como estava, sem pensar na hierarquia. |
| Botões grudados, tortos, alturas diferentes | Componentes do Arc (CSS modules com métricas próprias) misturados com Tailwind, sem uma régua de alturas comum. |
| Card dentro de card, linhas pretas grossas | O segmented control do Arc tem fundo e borda próprios e ficava dentro do painel. A classe `border-subtle` não existia no tema, então a borda caía no `currentColor` (preto). |
| Scrollbar "bugada" | Painel longo demais (tudo numa coluna) e scrollbar nativa sem estilo sobre vidro. |
| Vidro quebrado, "efeitos bugados" | `filter` (blur) animado num ancestral do vidro: um ancestral com `filter` quebra o `backdrop-filter` dos filhos. |
| Claro "impossível de ver" | A Noite clara aplicava um véu cinza de 62% sobre a foto inteira. |
| Campos surgindo do nada | Renderização condicional sem `AnimatePresence`: o slider de duração aparecia e sumia de uma vez. |
| Animações travadas | O `SlotText` girava cada dígito como uma roleta. O resto eram transições CSS de opacidade. |
| "Texto torto" e o check solto | O `InlineEdit` do Arc, com ícone de confirmação, no lugar de um campo simples. |
| Dock minúsculo numa tela de 2000px | Tamanhos fixos em px, pensados para 1280px. |

**Causa de fundo:** montei peças prontas sem desenhar a composição, e verifiquei por screenshots reduzidos em vez de usar o app em tamanho real.

## Padrão de qualidade (vale daqui em diante)

Nada é mostrado antes de passar por tudo isto:

1. **Uma régua de alturas:** controles com 32, 40 ou 48px (`sm`, `md`, `lg`), e tudo numa linha usa a mesma.
2. **Nunca card dentro de card:** grupos usam linhas finas (`List`/`Row`). Opções de um item ficam agrupadas com ele, sem linha no meio.
3. **Destrutivo é discreto:** ícone fantasma que aparece no hover da linha e pede confirmação no próprio botão (`ConfirmButton`), sem diálogo e sem vermelho em repouso.
4. **Nada aparece ou some sem transição:** todo elemento condicional passa por `AnimatePresence` com os presets de `lib/motion.ts` (`reveal`, `calm`, `glide`).
5. **Sem `filter` acima de vidro:** transições de camadas que contêm vidro usam só opacidade, deslocamento e escala.
6. **Tamanho real:** testar a 1200×760 e a 1920×1000, nos dois temas, usando de verdade: clicar, digitar, criar, apagar, esperar o repouso.

## O que mudou

- **Escopo:** só a Névoa, em claro e escuro, bem feita. A Noite e o Caderno voltam depois, em cima de uma base aprovada.
- **Primitivas próprias** em `components/ui/`:
  - `Button`, com variantes e régua de alturas;
  - `Tabs`, com o indicador deslizando por mola;
  - `Toggle`;
  - `List`/`Row`;
  - `Digits`, onde cada dígito sobe e assenta com desfoque e só os que mudam se mexem;
  - `ConfirmButton`, que pede confirmação no próprio botão.
- **Do Arc ficaram só três peças de comportamento complexo:** `Popover`, `Tooltip` e `ElasticSlider`. O painel virou Radix Dialog com Motion.
- **Tokens semânticos novos:**
  - em `atmospheres.css`: `--ink` (3 níveis), `--hairline`, `--fill-*`, `--glass-*` e `--accent*`;
  - os tokens do Arc passaram a ser derivados desses;
  - no escuro, o vidro tem saturação baixa, para não puxar o vermelho da foto.
- **Escala fluida:** `html { font-size: clamp(15px, 0.5vw + 8.5px, 18px) }`, para o app crescer em monitores grandes.
- **Dock:**
  - os espaços têm ícone e nome;
  - som: play/pause num clique, popover com grade de sons e volume, barras animadas enquanto toca;
  - claro/escuro com troca de ícone animada e acesso às configurações;
  - some em repouso só com opacidade e deslocamento.
- **Pomodoro:**
  - dígitos animados e campo de tarefa simples;
  - controles: botão principal largo, e pular/reiniciar como ícones da mesma altura, com reiniciar em dois toques;
  - ao recolher, o vidro e os controles esmaecem no lugar e os números não se mexem.
- **Respiração:** um orbe de vidro mais translúcido, com brilho no topo e um toque de lavanda; o rótulo e a contagem ficam dentro dele.
- **Painel de configurações:**
  - três abas (Este espaço, Espaços, Aparência), cada uma cabendo na tela, e o conteúdo entra suavemente ao trocar de aba;
  - nome e ícone do espaço editáveis, widgets com opções que abrem animadas embaixo de cada um;
  - criar um espaço vai direto para o nome selecionado, com um ícone ainda não usado;
  - apagar um espaço fica no hover e pede confirmação.
- **Dev:** editar um store recarrega a página. O HMR criava uma segunda cópia do store, e parte do app ficava ligada à antiga.

## Fluxos verificados no navegador (1200×760 e 1920×1000)

- Repouso e retorno: o dock some e volta; o pomodoro recolhe e expande.
- Pomodoro: iniciar, pausar, recolher (claro e escuro), pular e reiniciar com confirmação.
- Som: abrir o popover, escolher um som (toca), barras animando, pausar.
- Configurações:
  - abrir, trocar de aba, ligar e desligar widgets (as opções abrem e fecham animadas);
  - criar um espaço, nomear, apagar com confirmação;
  - alternar claro e escuro.
- Troca de espaço pelo dock e pelos atalhos 1, 2 e 3.

## O que ainda falta (honestamente)

- **Teclado:** as setas não navegam dentro dos grupos de opção (abas, sons, ícones); hoje só o Tab funciona. Implementar o padrão de foco itinerante.
- **Celular:** a composição de coluna e o bottom sheet não existem ainda.
- **Ícones:** ainda são Lucide provisórios; a biblioteca própria vem da skill `generate-icons`.
- **Contraste:** remedir com os fundos definitivos (item 4).
- **Bundle:** 192KB gzip. Otimizar no item 6.
- **Lembretes e escolha de fundo** ainda não têm interface.

## Status e próximos passos

**26/11/2026:** o Bruno aprovou a direção ("agora sim temos um protótipo... não é perfeito, mas é uma boa direção"). O item 3 continua em cima desta base, nesta ordem:

1. **Polimento e teclado:** os ajustes finos que o Bruno apontar ao usar, e setas navegando dentro de abas, sons e ícones (foco itinerante).
2. **Ícones próprios:** rodar a skill `generate-icons` contra estes tokens (ler os scripts dela antes) e trocar o Lucide em `content/icons.tsx`.
3. **Widgets que faltam:** lembretes (com a posição na zona) e escolha de fundo por espaço (a escolha da interface; a curadoria das imagens é o item 4).
4. **Celular:** composição em coluna e o painel como bottom sheet.
5. **Outras atmosferas:** Noite e Caderno, refeitas no mesmo padrão de qualidade.
