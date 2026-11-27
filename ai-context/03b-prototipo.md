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

- **Celular:** a composição de coluna e o bottom sheet não existem ainda.
- **Contraste:** remedir com os fundos definitivos (item 4).
- **Bundle:** 192KB gzip. Otimizar no item 6.
- **Halo sobre fundos claros:** o `.on-scene` vira uma mancha escura em gradientes claros (item 4).

## Status e próximos passos

**26/11/2026:** o Bruno aprovou a direção ("agora sim temos um protótipo... não é perfeito, mas é uma boa direção"). O item 3 continua em cima desta base, nesta ordem:

1. **Polimento e teclado:** os ajustes finos que o Bruno apontar ao usar, e setas navegando dentro de abas, sons e ícones (foco itinerante).
2. ↪ **Ícones próprios: adiados para o item 7 (logo)** (26/11/2026). Desenhei 28 ícones (linha 1.6, um tom "névoa" translúcido) e uma revisão deles, mas lado a lado o Lucide ficou mais fluido e mais próximo da estética buscada:
   - o Lucide sugere com formas abertas e gesto (vento na chuva, pássaro em movimento, concha em espiral);
   - os meus eram silhuetas fechadas, simétricas e preenchidas, pesadas para uma interface de vidro;
   - um conjunto próprio só faz sentido derivado de uma identidade, que ainda não existe.

   **Decisão:** o app volta exatamente ao Lucide de antes (traço 1.6, 20px na grade de sons; 28px ficou grande demais com o Lucide). Os desenhos rejeitados estão guardados localmente em `.icon-work/rejected-v1/` (fora do git), como referência do que não fazer.
3. ✅ **Widgets que faltam** (26/11/2026):
   - **Fundo por espaço:** faixa de miniaturas em "Este espaço", com rolagem horizontal pela roda, setas e um anel de acento que desliza até a escolhida.
     - A cena faz um crossfade lento (0,9s) e só mostra a foto nova depois que ela carregou.
     - Só vira base uma foto que terminou de entrar, então trocar rápido nunca deixa a cena vazia.
     - Em dev, a faixa usa os 33 fundos do v1, em `media/legacy/` (fora do git), com miniaturas de 320×200. O item 4 troca o catálogo e a interface fica igual.
   - **Lembretes:** uma frase sua por vez, direto na cena (L1), com o tipo num rótulo pequeno.
     - Troca devagar a cada fase do pomodoro ou a cada 10 minutos.
     - No hover aparecem "próximo" e "editar", em pílulas de vidro (texto branco solto some em fotos claras).
     - Editar abre a lista ali mesmo, num popover: o texto se edita no lugar, os tipos abrem na linha em uso e apagar pede confirmação. Os vazios saem quando o popover fecha.
     - Nas configurações fica só mostrar ou esconder, com a contagem de lembretes.
     - Sem posição configurável, como a citação e o relógio: a composição decide.
   - **Achado nos testes:** em fundos claros (gradientes rosa e pastel), o halo escuro atrás do texto da cena (`.on-scene`) vira uma mancha. Isso entra no item 4, junto com a medição de contraste nos fundos definitivos.
   - **Revisão do Bruno (26/11/2026), corrigido:**
     - **Vidro que demorava a borrar** (dock, pomodoro): no Chrome, um ancestral com opacidade < 1 vira "backdrop root" e o `backdrop-filter` dos filhos para de ver a foto até a animação acabar. Agora os contêineres animam variáveis (`--space-fade`, `--item-fade`, `--self-fade`) e só as folhas (`.fade`: o vidro e o texto) aplicam a opacidade. A regra do padrão de qualidade "sem filter acima de vidro" vale também para opacidade.
     - **Fundos:** a faixa lateral (rolagem escondida) virou uma grade de 3 colunas, rolando com o painel. Fechada mostra duas linhas e um "Show all"; abre sozinha se a escolhida estiver mais para baixo.
     - **Anéis de foco cortados:** o `Reveal` (componente novo) só corta o conteúdo enquanto anima; parado, o overflow fica visível. O popover de lembretes ganhou folga em volta da lista.
     - **Sombra atrás dos textos da cena:** o halo escuro saiu. No lugar entrou a tinta adaptativa (`lib/sceneTone.ts`): mede a foto atrás de cada texto e escolhe tinta clara, tinta escura ou clara com uma sombra difusa mais forte, para fundos mistos.
     - Os 8 ícones de espaço ficam numa grade de 8 colunas e não quebram linha com a barra de rolagem.
   - **Layout livre com grade magnética** (aprovado e implementado em 26/11/2026). Substitui as 5 zonas, cujas animações eram ruins: as linhas da grade eram compartilhadas, um canto mexia no outro, e trocar de zona remontava o widget.
     - **Modelo:** cada widget tem `place` (um cruzamento de uma grade 12 × 8, em frações da área útil) e `size` (S/M/L). A âncora vem do terço em que o ponto cai: perto da direita, o widget se prende pela borda direita e o texto se alinha à direita. Os dados antigos migram na v2 do store (`position` → `place`), com teste.
     - **Palco** (`app/Stage.tsx`): posição absoluta, então nada empurra nada. Toda mudança de lugar (arrastar, setas, reset, achar lugar livre) passa por um só FLIP: mede onde estava e onde ficou, e uma mola leva a diferença a zero. Entrada e saída esmaecem e escalam no lugar. Medido no navegador: ao desligar a respiração, os outros widgets não mexeram nem um pixel.
     - **Sem sobreposição:** quem aparece ou cresce em cima de outro vai para o lugar livre mais próximo e, se não couber, diminui um tamanho. Ao abrir, um dado antigo sobreposto se resolve (o que vem depois na ordem cede).
     - **Modo de arranjar** (botão no dock ou `E`; sai com `Esc`, `E` ou "Done"):
       - aparecem uma grade de pontos e um contorno em cada widget;
       - arrastar mostra onde o widget vai cair (contorno em acento) e as guias quando ele se alinha a outro ou ao centro;
       - Tab escolhe um widget, as setas movem uma casa e Shift move três;
       - no hover aparecem os tamanhos S/M/L;
       - a barra com "Reset" e "Done" fica no lugar do dock, que some, então nunca cobre um widget.
     - **Grade pura e testada** (`app/layout/grid.ts`): âncora, retângulo, encaixe, lugar livre e passo do teclado.
     - **Bug achado e corrigido:** o `<main>` tinha `overflow: hidden`, e ao focar algo perto da borda o navegador rolava o app inteiro para o lado. Agora é `overflow: clip`.
     - **Limites conhecidos:**
       - numa janela bem menor, widgets podem se sobrepor (as posições escalam, mas o app não empurra ninguém sozinho fora dos casos acima);
       - arrastar ainda não funciona no celular, que é o próximo passo (coluna e bottom sheet).
   - **Duas revisões do Bruno sobre o layout livre (26/11/2026), corrigidas e medidas quadro a quadro:**
     - **Balanço ao soltar:** o FLIP usava `MotionValue.set`, que registra velocidade. Um salto de centenas de px em zero segundos virava uma velocidade enorme herdada pela mola. Agora usa `jump`.
     - **Botões de dentro voando ao soltar** (o "Start focus", o indicador S/M/L): a animação de `layout` do Motion mede a página, então ver o widget mudar de lugar animava cada filho. `layoutRoot` não resolveu. Agora nada dentro do palco usa `layout`:
       - `Tabs` mede o botão escolhido e desliza o fundo;
       - `ConfirmButton` anima só a largura;
       - o botão principal do pomodoro não precisa animar.
       - Medido: o botão ficou a 154,266 px do vidro em todos os quadros do arrasto.
     - **Trocar o tamanho escorregava de baixo para cima:** o FLIP comparava retângulos, e o canto superior esquerdo muda quando o tamanho muda. Agora compara o ponto da grade (calculado com o tamanho atual), e a troca de tamanho cresce a partir da âncora com uma escala de 0,45s. Medido: o centro ficou parado durante toda a troca.
     - **Reset amontoava widgets:** cada espaço tem um lugar inicial próprio para cada widget, inclusive os desligados. A regra "ninguém em cima de ninguém" vale sempre: depois de um reset, ao redimensionar a janela (o palco renderiza de novo) e com dado antigo.
     - **Switch:**
       - desliza com CSS (`translate-x`), sem a animação de `layout` (que pulava com a linha ao lado abrindo) e sem a mola em `rem`;
       - a linha inteira é um `<label>`, então clicar no texto liga e desliga.
     - **Painel:**
       - fundos fechados por padrão, com "Show all" como link ao lado do título e a escolhida sempre à vista;
       - na lista de espaços, o atual fica preenchido e diz "Current", e a lixeira fica sempre visível numa coluna própria, com "Delete" em vermelho ao confirmar;
       - "Restore default spaces" virou uma linha com explicação e botão;
       - o campo de nome não volta a ser selecionado ao trocar de aba;
       - o `Reveal` não corta mais quando abre sem animação (era o canto reto das linhas).
     - **Barra do modo de arranjar:** mais espaço, texto secundário legível e as teclas desenhadas como teclas.
     - **Tinta da cena:** mede de novo assim que o tema muda (observa o `data-theme`).
     - **Fundos por espaço:** já eram individuais, mas todos começavam iguais. No protótipo, Focus e Relax já começam com fundos próprios.
   - **Terceira revisão do Bruno (26/11/2026), corrigida:**
     - **Troca de tamanho padronizada:** a escala da rodada anterior só servia para o relógio. Os outros widgets não mantêm a proporção entre S, M e L (o lembrete cresce 26% na largura e 6% na altura, porque o rótulo e os botões não crescem), então qualquer escala única encolhia um lado antes de crescer, ou pulava. Agora o tamanho é contínuo (`lib/widgetSize.ts`): o palco põe `--k` (0 = S, 1 = M, 2 = L) em cada widget e anima o número, e cada medida do widget é interpolada a partir dele (`sized(s, m, l)`). O layout de verdade vai de um tamanho ao outro, a partir da âncora. O tamanho final é medido antes da animação, para a regra de sobreposição. Medido: lembrete 145 → 146 → 152 → 184 px, citação 500 → 468 → 433 → 330 px, com o canto da âncora parado.
     - **Tamanhos de um widget roubando o clique do vizinho:** apagados, os S/M/L continuavam clicáveis por cima do widget de baixo. Agora não pegam clique enquanto invisíveis, aparecem só com o mouse em cima ou com foco de teclado (clicar num tamanho não os deixa abertos), e o widget sob o mouse fica por cima dos outros.
     - **"Delete" e a lixeira voando:** o ícone que saía ficava preso à borda esquerda do botão, que andava enquanto ele crescia. Agora os dois rótulos ficam empilhados e centrados e trocam com um esmaecer de CSS. A largura é lida com `offsetWidth` no clique e aplicada direto no elemento (um `width: auto` em linha deixava o botão de ícone estreito).
     - **Switch:** anima mesmo com "reduzir movimento" (o sistema do Bruno está com as animações desligadas no GNOME), porque é um deslize curto no lugar. A linha deixou de ser um `<label>`: um <label> em volta de um <button> repassa o clique sozinho, o que varia entre navegadores e pode acionar o switch duas vezes (ele piscava entre ligado e desligado). Agora a linha repassa o clique de forma explícita, só quando ele não caiu num controle. Medido com cliques reais: uma troca por clique no botão, na bolinha e no texto.
     - **Switch piscando (causa achada):** gravei quadro a quadro, por screencast do DevTools, uma janela do Chrome com GPU e os dados do Bruno (tema escuro), clicando de verdade. Em cerca de 1 a cada 5 cliques (13 em 72), no quadro em que a transição termina o switch reaparecia por um quadro no estado anterior. O estilo calculado da página, lido no mesmo quadro, nunca voltava: o defeito é do desenho. O Chrome roda transições de `background-color` na GPU, e ao devolver o valor final às vezes desenha a cor inicial. A cor de "ligado" virou uma camada que esmaece por opacidade. Depois: 0 em 32. Dar ao switch uma camada própria (`will-change`) não resolvia, e o Chrome sem GPU (headless) não mostrava o defeito.
     - **Outras transições de cor de fundo** (ícones do espaço, linhas da lista de espaços trocando o espaço e a cena, hover de botão): gravadas do mesmo jeito, 12 trocas cada, nenhuma piscou. Ficaram como estão.
     - **Lembretes nas configurações:** saiu a frase "edit on the screen", que explicava um caminho em vez de oferecer um. A lista editável no painel foi testada e descartada (o editor do popover, espalhado numa lista de configurações, não deixava claro onde um lembrete começa e termina). Ficou só a contagem ("2 reminders", ou "None yet"), sempre visível: como a citação, o painel liga e desliga e os lembretes se editam na tela, onde aparecem.
     - **Animações dos lembretes (widget e editor):**
       - a fileira "próximo / editar" aparecia e sumia sem animar: o primeiro lembrete (ou o último apagado) fazia o widget, e o popover ancorado nele, pular 44px. Agora entra e sai abrindo a altura (`Reveal`);
       - a troca de frase deixava a célula com a altura da maior das duas até o fim e depois pulava. Agora a frase que sai deixa o fluxo (`popLayout`) e a altura anima (`AutoHeight`, novo, que escreve a altura direto no elemento no instante da medida; com MotionValue o primeiro quadro saía com a altura nova inteira);
       - no editor, o tipo e as opções de tipo trocavam por cima um do outro (`popLayout`); agora fecham e abrem a altura juntos;
       - a lista só rola (e mostra barra) quando o conteúdo parado passa do limite; antes a barra piscava com o que sobrava por um instante durante as animações.
       - Nada é cortado dos lados durante as animações: `AutoHeight` e `Reveal` cortam só na vertical (`overflow-y: clip`; `hidden` cortava dos dois lados, e o "Add a reminder" saía cortado à direita). A fileira de botões abre o espaço sem cortar (`Reveal clip={false}`): o botão esmaece inteiro no lugar.
       - Medido na tela (gravação da GPU): o popover desce 78 → 84 → 93 → 103 → … → 136 px ao digitar o primeiro lembrete e sobe 136 → 132 → 122 → … → 78 ao apagar o último, sem voltar nem pular.
     - **Regressão corrigida na mesma rodada:** ao deixar os S/M/L sem clique enquanto invisíveis, o vão de 8px entre o contorno e eles perdia o hover, e os tamanhos sumiam no caminho do mouse. O vão agora é padding dos próprios tamanhos. Testado com o mouse andando em passos curtos até os botões, nos dois lados (embaixo do lembrete, em cima do relógio), e com cliques seguidos.
4. **Celular:** composição em coluna e o painel como bottom sheet.
5. **Outras atmosferas:** Noite e Caderno, refeitas no mesmo padrão de qualidade.
