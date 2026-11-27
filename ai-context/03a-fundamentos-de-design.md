# 3a. Fundamentos de design do Nova

Status: **rascunho para discussão (26/11/2026)**. Vem antes de tokens e telas: define o que o Nova é, para quem, em que situação, o que evitar e um padrão de construção com motivo para cada decisão. A primeira rodada de "direções" (A/B/C em `03-design.md`) pulou essa etapa e por isso ficou rasa.

---

## 1. Propósito

**O Nova é um lugar, não uma ferramenta.** É um cenário calmo que fica aberto na tela enquanto a pessoa estuda, trabalha ou descansa. Ele ajuda em duas coisas e em mais nada:

- **Ritmo:** alternar foco e pausa (pomodoro), respirar e lembrar do que importa.
- **Clima:** imagem e som que acalmam e isolam do entorno.

> Trabalho a ser feito: *"Quero um lugar calmo na tela que me ajude a manter o ritmo e o clima, sem pedir a minha atenção."*

Consequência direta: o Nova faz sucesso quando é **esquecido** durante o foco e **encontrado sem esforço** quando é preciso. Toda decisão abaixo deriva disso.

### O que o Nova não é

- **Não é app de produtividade:** não tem lista de tarefas, metas, streaks, ranking nem relatório de "horas produtivas".
- **Não é player de música:** o som ambiente é textura, não conteúdo.
- **Não é painel de informação:** nada de clima, notícias ou notificações.

---

## 2. Contextos de uso e o que cada um exige

| Contexto | Situação real | Exigência de design |
|---|---|---|
| **Segunda tela** (principal) | Monitor ao lado, a 60–100cm, olhado de relance | Informação legível **de longe e num relance**: timer e relógio grandes, alto contraste, pouco texto. |
| **Tela cheia no foco** | Única tela, Nova em tela cheia durante um bloco de estudo | Nada se mexe nem pede atenção. **Controles somem quando não estão em uso.** |
| **Sessão longa** | Horas aberto | Sem cor saturada, sem brilho alto, sem animação contínua chamativa. Conforto visual acima de impacto. |
| **Noite** | Quarto com pouca luz | Escuro quente (nunca preto puro), cena escurecida, nada de branco estourado. |
| **Pausa / relaxar** | Respirar, ouvir chuva, olhar a paisagem | A cena ganha espaço. Respiração guiada é a única coisa que se move de propósito. |
| **Celular** (secundário) | Apoiado na mesa como relógio/timer, ou na mão | Toque, bottom sheet, retrato e paisagem. Mesmos princípios, outra composição. |

---

## 3. Problemas a evitar (e de onde vêm)

### Do próprio v1

- **Neon sobre preto:** ciano com saturação de 100% sobre um fundo quase preto. Tem cara de app gamer, não de lugar calmo.
- **Cards opacos brigando com a foto:** a interface competia com a cena em vez de assentar sobre ela.
- **Excesso de estilos:** 5 fontes e 4 bibliotecas de ícones, sem papel definido para cada uma.
- **Configuração pesada:** uma sidebar enorme como porta de entrada da personalização.
- **Temas que só trocavam cor:** a estrutura era a mesma, e por isso pareciam "skins" neon.

### Da categoria (apps de foco/lofi)

- **Gamificação:** streaks, badges e metas geram ansiedade e culpa. É o oposto do propósito.
- **Acúmulo de features:** players, chats, to-dos e estatísticas transformam o "lugar" num painel.
- **Decoração no lugar de função:** partículas, gradientes animados e brilhos chamam atenção para si.

### Da pesquisa

- **Glassmorphism mal calibrado.** A NN/g aponta a legibilidade como o principal problema: texto claro ou escuro demais e fundos movimentados. A Axess Lab lista contraste baixo, interferência do fundo e carga cognitiva. **Conclusão:** vidro só onde há conteúdo, com blur forte e tinta suficiente para garantir **4.5:1** (texto normal) e **3:1** (texto grande, ≥ 24px ou ≥ 18.5px em negrito), medido contra os fundos reais. Também é preciso um modo sem transparência. O `prefers-reduced-transparency` só funciona em Chromium, então o modo opaco também tem que existir como opção no app.
- **Texto sobre foto.** Num estudo da *Ergonomics* (2020), desfoque gaussiano e scrim semitransparente foram o que mais protegeu a legibilidade, e a sombra foi o melhor tratamento letra a letra. A NN/g recomenda gradiente/scrim só onde há texto, e não um véu sobre a imagem inteira. Uma solução que funciona numa foto pode falhar em outra, então **testar todos os fundos**.
- **Glanceability.** O tamanho legível depende do ângulo visual (distância), não de pixels. Pesos muito finos somem a distância, e números tabulares evitam que o timer "dance".

---

## 4. Princípios (com o porquê)

Cada princípio tem um teste prático para decidir casos concretos.

**P1. Periferia primeiro.** *(Calm Technology: a tecnologia fica na periferia e só vem para o centro quando precisa.)*
Em repouso, a tela mostra a cena e no máximo dois elementos de leitura (ex.: timer e relógio). Controles aparecem com intenção (mouse, teclado, toque) e somem após alguns segundos parados.
- **Teste:** *"Isso precisa estar visível enquanto ninguém mexe?"*

**P2. Legível de relance, de longe.**
A hierarquia é por **distância de leitura**, não por "importância de produto". Há três escalas: *glance* (lido a 1m), *read* (lido quando se olha) e *act* (usado com o mouse). Contraste medido, nunca no olho.
- **Teste:** *"Dá para ler o tempo restante de relance, do outro lado da mesa?"*

**P3. A cena é a protagonista; a interface é um material sobre ela.**
A UI não é um "card" genérico: é um material definido pelo tema (vidro, papel, tinta). Elementos leves (relógio, citação) ficam direto na cena, sem superfície.
- **Teste:** *"Se eu tirar a foto, a interface ainda parece pertencer a algum lugar?"* (deveria parecer incompleta)

**P4. Ritmo, não desempenho.**
Mostramos o ciclo (foco, pausa, onde estou), nunca a produtividade (horas, streaks, metas).
- **Teste:** *"Isso pode fazer alguém se sentir em dívida?"* Se sim, sai.

**P5. Movimento lento e com propósito.**
Movimento só para mudança de estado, com transições mais longas que o padrão de UI e sem overshoot. A respiração guiada é a única animação contínua, porque ela é o conteúdo.
- **Teste:** *"Isso se mexe porque algo mudou, ou para chamar atenção?"*

**P6. Silencioso por padrão.**
Sem notificações do sistema. O alarme entra em fade-in suave, e o feedback é visual e discreto.

**P7. Personalizar sem configurar.**
Temas e espaços já vêm completos e bonitos. Configuração é refinamento opcional, não pré-requisito.

---

## 5. O padrão: modelo de camadas

Este é o "padrão a ser seguido": todo elemento do Nova pertence a **uma** camada, e a camada define o material, o comportamento e onde ele pode ficar.

| Camada | O que entra | Material | Comportamento |
|---|---|---|---|
| **L0 · Cena** | Foto + scrim adaptativo | — | Sempre presente. O scrim é um gradiente localizado onde há texto, e não um véu na imagem inteira. Escurece à noite. |
| **L1 · Ambiente** | Relógio, data, citação | **Nenhum.** Tipografia direto na cena, com sombra suave | Sempre visível (se ativado). Escala *glance*/*read*. Nunca interativo em repouso. |
| **L2 · Instrumentos** | Pomodoro, respiração, lembretes | **Superfície do tema** (vidro, papel...) | Visível enquanto em uso. Tem forma **completa** (com controles) e **recolhida** (só o essencial, ex.: o timer). Em repouso, recolhe. |
| **L3 · Controles** | Dock de espaços, som ambiente, abrir configurações | Superfície do tema, menor | **Aparece com intenção e some** depois de ~3s parado. Teclado sempre funciona. |
| **L4 · Painéis** | Configurações, gerenciar espaços, escolher fundo/som | Superfície do tema, mais opaca | Drawer no desktop e bottom sheet no celular. Escurece a cena atrás. Um painel por vez. |

### Composição

> **Revisto em 26/11/2026** (ver `03b`, "Layout livre"). As 5 zonas fixas saíram: as linhas da grade eram compartilhadas, então um canto mexia no outro, e o usuário não podia pôr nada onde queria.

- **Grade magnética:** a área útil (a tela menos as margens e a **faixa inferior reservada** ao L3) tem 12 colunas e 8 linhas. Cada widget fica num cruzamento e se prende pela borda do terço em que está: esquerda, centro ou direita (e o mesmo na vertical). O texto se alinha ao mesmo lado.
- **Independência:** cada widget tem a sua posição. Pôr, tirar ou mover um widget nunca mexe nos outros.
- **Nunca sobreposição:** quem aparece ou cresce em cima de outro vai para o lugar livre mais próximo. Se não houver lugar, diminui um tamanho.
- **Tamanhos S/M/L por widget,** escolhidos pelo usuário. O "herói" automático do centro saiu.
- **Layouts iniciais desenhados** por espaço: o relógio grande no Home, o pomodoro no Focus e a respiração no Relax, todos no centro. Há um "Reset" no modo de arranjar.
- **Celular:** a composição vira uma coluna, com o elemento principal no topo (ainda por fazer).

### Estados de atenção

- **Repouso:** só L0, L1 e L2 recolhido.
- **Atento:** o mouse se mexeu, aparecem L3 e L2 completo.
- **Configurando:** L4 aberto, com o resto recuado.

Isso vira estado runtime no app (não persistido): um único `attention: "rest" | "active" | "configuring"`.

---

## 6. Temas: atmosferas, não paletas

O v1 falhou porque cada tema trocava só a cor. **No Nova, um tema é uma atmosfera completa.** Claro e escuro são um eixo independente: todo tema tem os dois.

| Dimensão | O que o tema define |
|---|---|
| **Paleta** | Tinta, superfície, acento (claro e escuro) |
| **Material** | Vidro (blur + tinta), papel (opaco + grão sutil), tinta (sem superfície, só linhas) |
| **Tipografia** | Família de display (relógio, timer, citação) e de interface, mais o peso do display |
| **Forma** | Raio dos cantos, espessura das bordas |
| **Movimento** | Caráter: fluido (blur + escala), seco (só opacidade), mínimo |
| **Ícones** | Espessura do traço (`--icon-stroke`), com o mesmo desenho |
| **Cena** | Tipo de scrim, grão, quanto escurecer à noite |

### Arquitetura (o que a pesquisa recomenda)

Três níveis de tokens:

```
base (valores crus: oklch, px, ms)
  → semânticos (--surface, --ink, --accent, --material-blur, --radius-card,
                --font-display, --motion-ease, --icon-stroke…)
    → componentes (só leem semânticos)
```

- **Mesmos tokens em todo tema.** Os componentes nunca sabem qual tema está ativo; um tema só troca o conjunto de valores (`[data-atmosphere="nevoa"][data-theme="dark"]`).
- **Fontes por tema carregadas sob demanda**, para não pagar o peso de todos os temas.
- **Ícones:** uma biblioteca só (gerada no projeto), desenhada em traço com `stroke-width: var(--icon-stroke)`. O tema ajusta o peso sem redesenhar.

### Três atmosferas para começar (estruturalmente diferentes)

| | **Névoa** (padrão) | **Caderno** | **Noite** |
|---|---|---|---|
| Sensação | Ar, luz difusa | Papel, mesa de estudo | Silêncio, escuro, tela cheia |
| Material | Vidro fosco | Papel opaco com grão sutil e sombra de objeto | Nenhum: tipografia e linhas finas sobre a cena escurecida |
| Display | Sans geométrica e leve | Serifa editorial | Grotesca estreita e numerais grandes |
| Forma | Cantos generosos | Cantos pequenos | Sem cantos (não há caixas) |
| Movimento | Fluido, com leve desfoque | Seco, curto | Quase nenhum |
| Melhor para | Uso geral | Estudo, leitura | Segunda tela à noite, foco profundo |

As três têm claro e escuro, mas cada uma tem um "modo natural" (a Noite é escura por natureza; o claro dela é um cinza-pedra, não branco).

---

## 7. Componentes reais (inventário para o protótipo)

| Peça do Nova | Componente (Arc, plano grátis) | Por quê |
|---|---|---|
| Fases do pomodoro | Segmented control | Uma escolha entre 3 opções sempre visíveis |
| Dígitos do timer | Slot text / Countdown | Troca de número suave, sem "piscar" |
| Volume | Elastic slider | Gesto tátil e leve, combina com som |
| Escolher som / fundo | Popover + Radio cards | Escolha visual, perto de onde se usa |
| Configurações | Drawer (desktop) / Bottom sheet (celular) | L4 sem sair da cena |
| Espaços | Tabs/Segmented no dock; Reorderable list e Inline edit no painel | Trocar é frequente (dock); gerenciar é raro (painel) |
| Resetar | Hold to confirm | Ação destrutiva sem um diálogo que quebre o clima |
| Dicas | Tooltip com o atalho de teclado | Descobrir os atalhos sem poluir |

---

## 8. Próximo passo proposto: protótipo vivo

Em vez de uma página estática, construir no próprio app (Vite + React + Arc + os stores do item 2) um protótipo funcional que **prove o padrão**:

1. **Camadas e estados de atenção:** repouso, atento e configurando, com os controles sumindo sozinhos.
2. **Os três espaços** com composições diferentes (relógio, timer e respiração no centro).
3. **O pomodoro de verdade**, rodando, nas formas completa e recolhida.
4. **Duas atmosferas lado a lado (Névoa e Noite, ou Névoa e Caderno)**, trocáveis ao vivo, provando que um tema muda material, tipo, forma e movimento, e não só a cor.
5. **Claro e escuro** em cada uma.
6. **Contraste medido** sobre o fundo atual, com o resultado anotado.

Esse código não é descartável: vira a base da UI real do item 3.

---

## Fontes

- Calm Technology: [Wikipedia](https://en.wikipedia.org/wiki/Calm_technology) · [O'Reilly, Principles of Calm Technology](https://oreilly.com/content/principles-calm-technology-we-are-not-bad-at-technology-technology-is-bad-at-us) · [Adobe, Calm Technology in the era of experience design](https://blog.adobe.com/en/publish/2016/10/12/calm-technology-in-the-era-of-experience-design)
- Glassmorphism: [NN/g, Glassmorphism](https://www.nngroup.com/articles/glassmorphism/) · [Axess Lab, Glassmorphism meets accessibility](https://axesslab.com/?p=5111)
- Texto sobre imagem: [NN/g, Text over images](https://www.nngroup.com/articles/text-over-images/) · [Smashing, Accessible text over images (parte 1)](https://smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1) · [Ergonomics 2020, Glanceable typography over complex backgrounds](https://pubmed.ncbi.nlm.nih.gov/32425139/) · [W3C, F83](https://www.w3.org/TR/WCAG-TECHS/F83.html)
- Legibilidade de relance: [MIT AgeLab, Glance-based legibility](https://agelab.mit.edu/transportation-and-livable-communities/projects/glance-based-legibility) · [Android, tipografia por ângulo visual](https://developer.android.com/design/ui/ai-glasses/guides/styles/type?hl=en) · [Dobres et al., polaridade](https://pmc.ncbi.nlm.nih.gov/articles/PMC5213401)
- Transparência reduzida: [MDN, prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)
- Natureza e restauração da atenção: [Berman et al., The cognitive benefits of interacting with nature](https://pubmed.ncbi.nlm.nih.gov/19121124/)
- Temas além da cor: [Brad Frost, The many faces of themeable design systems](https://bradfrost.com/blog/post/the-many-faces-of-themeable-design-systems/) · [Brad Frost, The new separation of concerns](https://bradfrost.com/blog/post/the-new-separation-of-concerns/) · [gossi, theming além de cor](https://gist.github.com/gossi/1b83d6ec3740b00152fe3269a3b59dec) · [Meta XDS, theming infrastructure](https://github.com/facebookexperimental/xds/wiki/Theming-Infrastructure)
- Categoria: [Design critique do Endel](https://ixd.prattsi.org/2026/02/design-critique-endel-ios-app/) · [Um timer de foco que não tenta ser coach](https://dev.to/leozhang8285/i-built-a-focus-timer-that-doesnt-try-to-be-your-life-coach-4jc6)

---

## 9. Protótipo vivo, primeira versão (26/11/2026): reprovada

> Esta versão foi reprovada. O diagnóstico, o padrão de qualidade adotado e a segunda versão estão em [03b-prototipo.md](03b-prototipo.md). O texto abaixo fica só como histórico.

Construído no próprio app; não é descartável. Para ver, rode `pnpm dev` e abra `localhost:5173`. Os atalhos são:

- **1, 2 e 3:** trocar de espaço.
- **Espaço:** iniciar ou pausar o pomodoro.
- **M:** ligar ou desligar o som.
- **Vírgula:** abrir as configurações.

### O que prova

| Fundamento | Onde está |
|---|---|
| **Camadas L0–L4** | `Scene` (L0), `Stage` com `Clock` e `Quote` (L1) e `Pomodoro` e `Breathing` (L2), `Dock` (L3), `SettingsPanel` (L4). Primitivas de camada em `globals.css`: `.on-scene`, `.material`, `.glance` e `.label`. |
| **Estados de atenção** | `stores/attention.ts` e `app/useAttention.ts`. Em repouso (3,5s parado) o dock some, o cursor some e o pomodoro em andamento recolhe para só os números. Nada some debaixo do ponteiro nem com o foco do teclado dentro de um controle (`data-keep-awake`). |
| **Composição por zonas** (substituída pelo layout livre, ver `03b`) | Era `app/composition.ts`: os instrumentos disputavam o centro e o elemento do centro virava o "herói". |
| **Atmosferas estruturais** | `styles/atmospheres.css`. Névoa e Noite usam os mesmos tokens com valores diferentes: material (vidro ou nenhum), tipografia (Figtree ou Barlow Condensed com Inter), forma (cantos de 28px ou sem cantos), rótulos (normal ou caixa-alta espaçada), movimento (deslocamento e desfoque, ou só opacidade) e tratamento da cena. Os componentes não sabem qual atmosfera está ativa. |
| **Claro e escuro** | Eixo independente (`data-theme`) dentro de cada atmosfera. O "claro" da Noite é pedra, não branco. |
| **Acessibilidade** | Opção "Reduce transparency" no app, além do `prefers-reduced-transparency` (que só funciona no Chromium). `prefers-reduced-motion` zera o deslocamento e o desfoque. Atalhos de teclado funcionam com os controles escondidos. |
| **Componentes reais (Arc)** | Segmented control, Slot text, Elastic slider, Popover com Radio cards, Drawer, Switch, Inline edit, Hold to confirm, Tooltip e Theme switch. |

### Contraste medido (Névoa clara, fundo River Path, 1440×900)

A medição amostra os pixels da foto atrás de cada texto, aplica o scrim global e o halo localizado, e calcula a razão WCAG. A sombra de texto não entra na conta, então os números reais são um pouco melhores.

| Texto | Tamanho | Mediana | Pior 10% | Mínimo WCAG |
|---|---|---|---|---|
| Citação | 26px | 15.1 | 7.7 | 3:1 (grande) ✅ |
| Autor da citação | 13px | 13.3 | 11.6 | 4.5:1 ✅ |
| Relógio herói | 245px | 4.7 | 2.7 | 3:1 (grande): ⚠️ no limite onde o número passa sobre a nuvem branca |
| Data sob o relógio | 15px | 3.0* | 1.9* | 4.5:1: ⚠️ |

\* A medição só considerou o halo da própria data, não o do relógio, que também cobre ela, então o número real é maior. Na tela fica legível, mas precisa ser **medido de novo com os fundos definitivos (item 4)**. Se não passar, a data ganha peso 500 e um halo próprio mais forte.

**Como o halo foi calibrado:** no começo era um véu global de 22% no centro, com o relógio em 2.3 de mediana. Troquei por um scrim localizado (`--scene-local-scrim`, 56% no centro, com platô até 38% do raio) atrás de cada texto. O relógio subiu para 4.7 sem escurecer o resto da foto.

### Problemas que o protótipo revelou

- **Névoa escura fica "barrenta" sobre fotos quentes:** o `saturate(1.5)` do vidro puxa o vermelho da árvore. Reduzir a saturação do vidro no escuro e esfriar a tinta.
- **Noite clara parece lavada:** a névoa cinza de 62% apaga a foto. Pode ser a identidade dela ("pedra"), ou um véu mais leve com halos mais fortes. Decidir olhando.
- **Bundle grande:** 614KB de JS (202KB gzip), por causa de Motion, Radix e Lucide. Item 6: `LazyMotion`, carregar o painel e o popover sob demanda e trocar o Lucide pelos ícones próprios.
- **Fontes:** as duas atmosferas carregam todas as fontes no início. Carregar sob demanda por atmosfera (item 6).

### Ainda não está no protótipo

- A atmosfera **Caderno**.
- A **composição de celular** (coluna, bottom sheet).
- O widget de **lembretes**.
- Os **ícones próprios** (o Lucide é provisório).
- A **escolha de fundo** por espaço.

### Só no protótipo

- **Sons de dev:** em dev, os sons tocam a partir de `media/prototype-sounds/`, com 90s em Opus gerados dos WAVs do v1, fora do git. Em produção continua sem som até o item 5.
