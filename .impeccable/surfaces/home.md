# Surface brief: home (`/`)

Escopo: página inicial do Bora Vê. Modo: Persuade (o visitante decide qual show ver e chega à escolha de ingressos).
Público e tarefa: quem compra ingresso, provavelmente no celular, à noite, escolhendo o que fazer na semana.
Ação: escolher o evento e a quantidade de ingressos por setor (finalização de compra ainda não existe).
Conteúdo: 6 eventos fictícios em `src/data/featured-events.ts`, marcados como exemplo; fotos do Unsplash com crédito.
Restrições: PRODUCT.md (nada de prova social inventada), invariante de capacidade, dark, vermelho e dourado de lâmpada.
Direção: fixada pelo usuário (referência ciaoenergy.com + fotos de muro de pôsteres). O `concept-seed` não rodou porque o launcher do impeccable não executa nesta sessão; a direção do brief vence o sorteio de qualquer forma.
Build path: code-led (sem geração de imagem).

## Direction contract

THESIS: a home é um muro de rua à noite, coberto de cartazes, com uma única lâmpada de tungstênio. Escolher o show é deslizar o cartaz até ficar debaixo da luz. Recusa a grade de cards de evento com filtros que toda bilheteria entrega.

OWN-WORLD: chão de asfalto quase preto e quente, muro de tijolo apagado, luz de tungstênio dourada que cai em cone, vermelho de cartaz lambe-lambe, papel envelhecido para o texto. Big Shoulders Display em caixa alta e condensada para títulos, Schibsted Grotesk para leitura. Ingressos são canhotos de papel com picote.

STORY: o visitante vê o que está em cartaz, para no cartaz iluminado, desce para entender o show (local, data, história, quem sobe ao palco) e termina escolhendo quantos ingressos quer de cada setor, vendo o total.

FIRST VIEWPORT: luminária presa no topo, ao centro, com o cone de luz descendo sobre o cartaz central (proporção 2:3, ~58vh de altura). Dois cartazes de cada lado, inclinados em perspectiva e no escuro. Abaixo do cartaz iluminado: nome do evento em display grande, data e local numa linha, ação primária "Garantir ingresso" em vermelho e ação secundária "Conhecer o show". Setas nas laterais.

FORM: pinned pelo usuário (muro de cartazes sob lâmpada + carrossel infinito), posição 1 de 1, sem seed key (launcher indisponível). Interação assinatura: ao trocar de cartaz, a lâmpada pisca como tungstênio antes de assentar sobre o novo cartaz.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
