---
name: Bora Vê
description: Muro de cartazes à noite sob uma lâmpada de tungstênio.
colors:
  night: "#0c0a09"
  night-raised: "#16110e"
  wall: "#1f1714"
  soot: "#2b211c"
  paper: "#f2e8d8"
  paper-dim: "#c9b9a3"
  paper-faint: "#8f7f6c"
  ink: "#17110d"
  poster-red: "#d23a22"
  poster-red-deep: "#8f1d10"
  poster-red-ink: "#5a0f07"
  tungsten: "#ffc35a"
  tungsten-soft: "#ffdc95"
  tungsten-deep: "#c98a2a"
typography:
  display:
    fontFamily: "Big Shoulders Display Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 4.4vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk Variable, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  poster: "2px"
  control: "4px"
  stepper: "6px"
  stub: "10px"
  panel: "14px"
spacing:
  gutter: "clamp(1rem, 5vw, 4rem)"
  section: "clamp(4rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.poster-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "3rem"
    padding: "0 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.poster-red-deep}"
  button-ghost:
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "3rem"
  ticket-stub:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.stub}"
  order-summary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
    rounded: "{rounded.panel}"
---

# Bora Vê

## Overview

A interface é uma rua à noite: um muro de tijolo apagado, cartazes colados e uma única lâmpada de tungstênio. O que está iluminado é o que importa; o resto fica no escuro. O tema escuro vem da cena (quem compra ingresso à noite, no celular), não de gosto.

## Colors

- `night`, `wall`, `soot`: o chão e o muro. Nunca usar cinza neutro ou azulado; o escuro é quente.
- `tungsten` e variações: a luz. É a única fonte de brilho da página: o cartaz em destaque, números grandes, foco e seleção.
- `poster-red`: a ação principal e o chão da bilheteria (seção inteira em vermelho, não detalhe solto).
- `paper` e variações: texto e os canhotos de ingresso. `ink` só sobre `paper`.
- Toda cor nasce em `src/styles.css`. Cor arbitrária em className (`text-[#...]`) é erro de lint.

## Typography

- Display: Big Shoulders Display, caixa alta, condensada, peso 850, até 6rem. Títulos de evento, nomes de setor, preços, números de data.
- Leitura: Schibsted Grotesk. Corpo com 62–65ch de medida.
- Rótulos: Schibsted 600, caixa alta, tracking 0.14em, sempre em `paper-faint` ou `tungsten`. Nunca como "sobrancelha" acima de um título.
- Números de preço e data usam `tabular-nums` (classe `tabular`).

## Layout

- Home: muro (100svh) → ficha do show → bilheteria → rodapé.
- Ficha do show: cartaz fixo (sticky) à esquerda, conteúdo à direita; uma coluna abaixo de 960px.
- Mais espaço acima de um título do que abaixo.

## Elevation & Depth

- Profundidade vem da luz, não de cartões: o cartaz iluminado tem sombra deslocada para baixo e camada de luz no topo; os outros ficam em `brightness(.3)`.
- O carrossel usa perspectiva 3D real; o cone de luz fica entre o cartaz aceso e os vizinhos.

## Shapes

- Cartazes: retângulo 2:3 com cantos quase retos.
- Canhoto de ingresso: picote tracejado e dois recortes circulares na linha do picote (CSS mask).

## Components

- `Poster`: foto + tipografia de cartaz. Tons `red` e `gold` imprimem a foto em duotom (lambe-lambe); `night` mantém a foto natural.
- `PosterWall`: carrossel infinito (setas, teclado, swipe, pontos). Ao trocar, a lâmpada pisca como tungstênio uma vez.
- `TicketBooth`: canhotos com quantidade limitada por `maxPurchasable` (domínio) e resumo do pedido.

## Do's and Don'ts

- Faça: uma única fonte de luz por tela; o resto no escuro.
- Faça: ingressos como objetos de papel; dados em tabular.
- Não faça: grade de cards iguais de evento, gradiente em texto, glassmorphism, emoji como ícone.
- Não faça: prova social inventada (PRODUCT.md > Evidence on Hand).
