# 3. Design: de "edgy/neon" para calmo de verdade

Status: **pausado.** A primeira rodada de direções foi rasa (sem pesquisa nem padrão). O trabalho recomeça pelos fundamentos em [03a-fundamentos-de-design.md](03a-fundamentos-de-design.md). A "Névoa" foi a menos pior e sobrevive como uma das atmosferas, mas os valores abaixo são só referência.

## Diagnóstico do v1

- **Cores agressivas:** fundo quase preto (`220 20% 6%`) e ciano neon no `--primary` (`185 100% 55%`, saturação no máximo). O contraste é de "app gamer", não de "espaço calmo".
- **UI separada da foto:** cards pretos opacos por cima de fundos coloridos. A interface briga com a imagem em vez de conversar com ela.
- **Fontes demais:** 5 (Inter, Open Sans, Montserrat, Delius e uma fonte de countdown), sem um papel claro para cada uma.
- **Ícones de 4 bibliotecas diferentes**, cada uma com um traço.

## Princípios para a v2

1. **A foto é a protagonista.** A interface recua: poucas superfícies, translúcidas ou suaves, e nada de preto puro nem de cor saturada.
2. **Dois papéis tipográficos, no máximo duas famílias:** uma de *display* (relógio, timer, citação) e uma de *interface* (rótulos, botões).
3. **Um acento só**, de baixa saturação, usado com parcimônia (ação principal, progresso).
4. **O escuro é quente, não preto:** tons com um pouco de cor, superfícies acima de ~20% de luminosidade.
5. **Movimento lento e sem overshoot**, com os `motionTokens` do Arc. Respeitar `prefers-reduced-motion`.
6. **Legível sobre qualquer foto:** um *scrim* leve no fundo, sombra de texto suave nos elementos soltos (relógio, citação) e superfície nos elementos densos (pomodoro, painéis).

## Direções (protótipo em `media/design-lab.html`)

O protótipo é uma página local, fora do git. Com o `pnpm dev` rodando, fica em `http://localhost:5173/media/design-lab.html`. A mesma cena (relógio, pomodoro, citação, som ambiente e dock de espaços) aparece em três direções, cada uma com claro e escuro.

| | A · Linho | B · Névoa | C · Entardecer |
|---|---|---|---|
| Ideia | Papel quente, como um caderno | Vidro fosco, a foto atravessa a UI | Pensada para a noite, aconchegante |
| Superfícies | Opacas, cor de papel | Translúcidas com blur | Semi-opacas, ameixa profunda |
| Acento | Verde-sálvia | Lavanda de fim de tarde | Mel / âmbar |
| Display | Newsreader (serifa editorial) | Figtree leve (uma família só) | Fraunces macia |
| Interface | Inter | Figtree | DM Sans |
| Cantos | 18px | 22px | 26px |

## Decisão (26/11/2026)

**B · Névoa.** Vidro fosco translúcido, lavanda de fim de tarde como acento e uma família só, Figtree, com pesos leves para o display. Os valores de partida são os do protótipo:

- **Claro:** superfície `oklch(98% .005 280 / .52)` com blur de 28px e `saturate(1.4)`; texto `oklch(26% .02 280)`; acento `oklch(55% .09 290)`.
- **Escuro:** superfície `oklch(22% .02 280 / .48)`; texto `oklch(96% .008 280)`; acento `oklch(80% .07 300)`.
- **Scrim** sobre a foto: `oklch(30% .03 280 / .10)` no claro e `oklch(14% .03 280 / .40)` no escuro.
- **Forma:** cantos de 22px nos cards e pílulas totalmente arredondadas.

Pontos a cuidar na implementação:

- **Contraste:** o vidro claro sobre fotos muito claras (céu, neve) pode perder contraste. Medir contra os fundos reais do item 4 e, se preciso, subir a opacidade da superfície.
- **Performance:** `backdrop-filter` custa GPU em telas grandes. Testar no item 6 e ter um fallback opaco (`@supports not (backdrop-filter: blur())`).

## Escopo do item, depois da escolha

1. **Tokens:** paleta clara e escura no `foundation.css` do Arc, raios, sombras, tipografia via Fontsource e o *scrim* do fundo.
2. **Ícones:** biblioteca própria com a skill `generate-icons`, a partir dos tokens (ler os scripts dela antes de rodar).
3. **Widgets:** relógio, pomodoro, citação, respiração, lembretes e som ambiente, com a posição de cada um.
4. **Navegação:** dock de espaços e painel de configurações (drawer no desktop, bottom sheet no mobile).
5. **Gerenciar espaços:** criar, renomear, trocar o ícone, reordenar e apagar.
6. **Responsivo:** celular e telas grandes (segunda tela).
