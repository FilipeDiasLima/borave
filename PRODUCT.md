# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas que querem ir a um evento e precisam garantir o ingresso. O momento crítico é a abertura das vendas de um evento disputado: muita gente tentando comprar ao mesmo tempo, com medo de ficar sem lugar ou de pagar por um ingresso que não existe.

Organizadores de eventos existem no produto (criam eventos, definem capacidade e preço), mas são um público secundário por enquanto.

## Product Purpose

O Bora Vê é uma plataforma de venda de ingressos para eventos com capacidade limitada. Sucesso é o comprador sair com a certeza de que o lugar dele é real: a compra conclui ou falha com clareza, nunca fica num estado ambíguo.

## Positioning

Compra confiável no pico de demanda. O Bora Vê nunca vende mais ingressos do que a capacidade do evento, mesmo com compras simultâneas, e se mantém de pé na abertura das vendas. O diferencial é a engenharia por trás da compra, não o catálogo de eventos.

## Operating Context

- Compras acontecem em rajadas: a abertura das vendas concentra a demanda em poucos minutos.
- O comprador provavelmente está no celular, com pressa e ansioso.
- Mercado (inferido do nome, do idioma do projeto e da regra de valores em centavos, ainda não confirmado): Brasil, interface em pt-BR, valores em reais.

## Capabilities and Constraints

- Invariante principal: um evento nunca vende mais ingressos do que sua capacidade, nem com compras simultâneas.
- Valores monetários sempre em centavos (inteiro).
- Autenticação por token em cookie `HttpOnly`, `Secure` e `SameSite=Lax`; nenhum dado sensível em Web Storage do navegador.
- Status de evento previsto: rascunho, publicado, cancelado. Só eventos publicados vendem.
- Em aberto: meios de pagamento, política de reembolso e transferência de ingressos, fila virtual na abertura das vendas, uso de lugar marcado versus pista.

## Brand Commitments

- Nome: Bora Vê.

## Evidence on Hand

Nenhuma. É um projeto de estudo sem usuários reais. Nenhuma tela pode exibir depoimentos, número de clientes, eventos realizados, parceiros, logos de empresas, avaliações ou métricas de uso, porque nada disso existe.

## Product Principles

1. **Certeza acima de tudo.** O comprador sempre sabe se tem ou não o ingresso; nenhum estado ambíguo.
2. **Honestidade sobre disponibilidade.** Esgotado é esgotado; a interface nunca sugere um lugar que não existe.
3. **Feito para o pico.** Toda decisão de produto considera o momento de maior demanda, não o caso médio.
4. **Nada inventado.** Sem prova social falsa; o produto se apresenta pelo que faz.
