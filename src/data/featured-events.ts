/**
 * DADOS DE EXEMPLO. Projeto de estudo: eventos, artistas, locais e números de venda
 * abaixo são fictícios. Este arquivo existe até o cadastro de eventos (Prisma) ficar pronto;
 * a home deve passar a ler do banco sem mudar o formato `FeaturedEvent`.
 *
 * Fotos: Unsplash (licença Unsplash), com crédito em `poster.creditUrl`.
 */

export type PosterTone = 'red' | 'gold' | 'night'
export type PosterLayout = 'title-bottom' | 'title-top'

export type TicketTier = {
  id: string
  name: string
  description: string
  priceCents: number
  capacity: number
  sold: number
}

export type LineupEntry = {
  name: string
  role: string
}

/** Por que o evento está no muro da home. Eventos sem destaque só aparecem na listagem. */
export type Highlight = 'semana' | 'mes'

export const HIGHLIGHT_LABEL: Record<Highlight, string> = {
  semana: 'Destaque da semana',
  mes: 'Destaque do mês',
}

export type FeaturedEvent = {
  id: string
  highlight?: Highlight
  category: string
  title: string
  presenter: string
  tagline: string
  startsAt: string
  doorsOpenAt: string
  durationLabel: string
  ageRating: string
  venue: {
    name: string
    address: string
    city: string
  }
  poster: {
    src: string
    alt: string
    tone: PosterTone
    layout: PosterLayout
    creditUrl: string
  }
  description: string
  story: Array<string>
  lineup: Array<LineupEntry>
  tiers: Array<TicketTier>
}

/** Limite de ingressos por pedido, por setor. */
export const PER_ORDER_LIMIT = 6

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=78`

export const featuredEvents: Array<FeaturedEvent> = [
  {
    id: 'sereno-de-lua',
    highlight: 'semana',
    category: 'Pagode',
    title: 'Sereno de Lua',
    presenter: 'Grupo Sereno de Lua',
    tagline: 'A roda que começou no quintal da Mooca agora ocupa o galpão inteiro.',
    startsAt: '2026-10-10T21:00:00-03:00',
    doorsOpenAt: '2026-10-10T19:30:00-03:00',
    durationLabel: '3 horas',
    ageRating: '18 anos',
    venue: {
      name: 'Galpão Fábrica',
      address: 'Rua dos Trilhos, 1200, Mooca',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1674168460210-9f1a2fbf730b'),
      alt: 'Percussionistas tocando tambores em frente a um prédio',
      tone: 'red',
      layout: 'title-bottom',
      creditUrl: 'https://unsplash.com/photos/0ljwSGHWz58',
    },
    description:
      'Uma noite inteira de pagode de raiz, com repertório autoral e os sambas que o público pede de cor desde a primeira roda.',
    story: [
      'O Sereno de Lua nasceu em 2014 numa roda de domingo, no quintal da casa da avó do cavaquinista Tião Moreira. A regra era uma só: quem chegasse com um instrumento tocava.',
      'Dez anos e dois discos depois, a roda virou palco, mas o formato continua o mesmo: o grupo toca em semicírculo, de frente para o público, e o show termina quando o último samba pedido for cantado.',
    ],
    lineup: [
      { name: 'Tião Moreira', role: 'Voz e cavaquinho' },
      { name: 'Dandara Lima', role: 'Voz e pandeiro' },
      { name: 'Ruço Batista', role: 'Surdo e tantã' },
      { name: 'Nego Ari', role: 'Banjo' },
      { name: 'Convidada: Lia Sombra', role: 'Participação especial' },
    ],
    tiers: [
      {
        id: 'pista',
        name: 'Pista',
        description: 'Em pé, acesso a toda a área do galpão.',
        priceCents: 8000,
        capacity: 800,
        sold: 612,
      },
      {
        id: 'pista-premium',
        name: 'Pista Premium',
        description: 'Área em frente à roda, com bar exclusivo.',
        priceCents: 14000,
        capacity: 300,
        sold: 300,
      },
      {
        id: 'camarote',
        name: 'Camarote',
        description: 'Mezanino com vista da roda e mesas compartilhadas.',
        priceCents: 26000,
        capacity: 120,
        sold: 97,
      },
    ],
  },
  {
    id: 'a-ultima-sessao',
    highlight: 'semana',
    category: 'Teatro',
    title: 'A Última Sessão',
    presenter: 'Cia. Lanterna Vermelha',
    tagline: 'O último cinema de rua da cidade fecha hoje. Ninguém quer ir embora.',
    startsAt: '2026-10-16T20:00:00-03:00',
    doorsOpenAt: '2026-10-16T19:30:00-03:00',
    durationLabel: '1 hora e 40 minutos',
    ageRating: '14 anos',
    venue: {
      name: 'Teatro Rubi',
      address: 'Rua Barão de Itaipu, 87, Bela Vista',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1503095396549-807759245b35'),
      alt: 'Silhueta de três atores no palco, contra a luz',
      tone: 'night',
      layout: 'title-top',
      creditUrl: 'https://unsplash.com/photos/p6rNTdAPbuk',
    },
    description:
      'Drama em um ato sobre o projecionista, a bilheteira e o último espectador de um cinema que fecha as portas depois de 70 anos.',
    story: [
      'A peça acontece em tempo real, durante a exibição do último filme. Enquanto a película roda, os três personagens descobrem que cada um tem um motivo diferente para não sair da sala.',
      'A Cia. Lanterna Vermelha montou o texto a partir de entrevistas com antigos funcionários de cinemas de rua do centro. Parte do cenário foi recuperada de salas que fecharam.',
    ],
    lineup: [
      { name: 'Helena Prado', role: 'A bilheteira' },
      { name: 'Osvaldo Reis', role: 'O projecionista' },
      { name: 'Caio Bastos', role: 'O espectador' },
      { name: 'Marina Toledo', role: 'Texto e direção' },
    ],
    tiers: [
      {
        id: 'plateia',
        name: 'Plateia',
        description: 'Inteira. Lugar marcado na plateia central.',
        priceCents: 9000,
        capacity: 220,
        sold: 141,
      },
      {
        id: 'meia',
        name: 'Plateia · Meia-entrada',
        description: 'Estudantes, professores e maiores de 60 anos, com comprovante.',
        priceCents: 4500,
        capacity: 100,
        sold: 88,
      },
      {
        id: 'balcao',
        name: 'Balcão',
        description: 'Primeiro andar, visão de cima do palco.',
        priceCents: 6000,
        capacity: 80,
        sold: 12,
      },
    ],
  },
  {
    id: 'sem-filtro',
    highlight: 'mes',
    category: 'Stand-up',
    title: 'Sem Filtro',
    presenter: 'Dani Ferraz',
    tagline: 'Uma hora de piada sobre tudo o que a gente pensa e não fala no grupo da família.',
    startsAt: '2026-10-17T22:00:00-03:00',
    doorsOpenAt: '2026-10-17T21:00:00-03:00',
    durationLabel: '1 hora e 10 minutos',
    ageRating: '16 anos',
    venue: {
      name: 'Casa Estopim',
      address: 'Rua Augusta, 2150, Jardins',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1516280440614-37939bbacd81'),
      alt: 'Microfone num pedestal sob luz de palco',
      tone: 'gold',
      layout: 'title-bottom',
      creditUrl: 'https://unsplash.com/photos/ekHSHvgr27k',
    },
    description:
      'Solo inédito de Dani Ferraz, gravado ao vivo nesta temporada. Material novo, sem repetir nenhuma piada do especial anterior.',
    story: [
      'Dani começou no open mic de um bar de esquina, contando histórias de quando trabalhava em telemarketing. O texto de "Sem Filtro" nasceu de um caderno onde ela anota tudo o que não teve coragem de responder na hora.',
      'A temporada tem só seis datas na Casa Estopim, um porão com 240 lugares onde a plateia fica a três metros do microfone.',
    ],
    lineup: [
      { name: 'Dani Ferraz', role: 'Solo' },
      { name: 'Beto Alcântara', role: 'Abertura' },
    ],
    tiers: [
      {
        id: 'mesa',
        name: 'Mesa na frente',
        description: 'Primeiras mesas, de frente para o microfone.',
        priceCents: 12000,
        capacity: 60,
        sold: 59,
      },
      {
        id: 'plateia',
        name: 'Plateia',
        description: 'Cadeiras em arquibancada, lugar livre.',
        priceCents: 7000,
        capacity: 180,
        sold: 101,
      },
    ],
  },
  {
    id: 'mare-alta',
    highlight: 'mes',
    category: 'Rock',
    title: 'Maré Alta',
    presenter: 'Turnê Água Funda',
    tagline: 'O disco mais pesado da banda, tocado inteiro, na ordem.',
    startsAt: '2026-10-23T20:30:00-03:00',
    doorsOpenAt: '2026-10-23T18:30:00-03:00',
    durationLabel: '2 horas',
    ageRating: '16 anos',
    venue: {
      name: 'Arena Viaduto',
      address: 'Av. Tiradentes, 1500, Luz',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1701460356554-b1fd41d0d010'),
      alt: 'Banda tocando no palco sob luz vermelha',
      tone: 'night',
      layout: 'title-bottom',
      creditUrl: 'https://unsplash.com/photos/MIL9OLUD_fs',
    },
    description:
      'Show de lançamento do terceiro disco do Maré Alta, com o álbum completo na primeira parte e os clássicos da banda no bis.',
    story: [
      '"Água Funda" foi gravado em uma semana, ao vivo no estúdio, sem metrônomo. A banda quis que o disco soasse exatamente como soa no palco, e o show devolve o favor.',
      'A turnê passa por oito capitais. São Paulo recebe a data de estreia, com abertura da banda paulistana Cais.',
    ],
    lineup: [
      { name: 'Joana Vidal', role: 'Voz e guitarra' },
      { name: 'Pedro Lune', role: 'Guitarra' },
      { name: 'Ícaro Mendes', role: 'Baixo' },
      { name: 'Teca Ramos', role: 'Bateria' },
      { name: 'Abertura: Cais', role: 'Banda convidada' },
    ],
    tiers: [
      {
        id: 'pista',
        name: 'Pista',
        description: 'Em pé, acesso à pista geral.',
        priceCents: 15000,
        capacity: 1500,
        sold: 1210,
      },
      {
        id: 'pista-frente',
        name: 'Pista Frente',
        description: 'Área cercada junto à grade do palco.',
        priceCents: 22000,
        capacity: 400,
        sold: 396,
      },
      {
        id: 'mezanino',
        name: 'Mezanino',
        description: 'Sentado, com visão frontal do palco.',
        priceCents: 19000,
        capacity: 300,
        sold: 120,
      },
    ],
  },
  {
    id: 'quarteto-bambu',
    highlight: 'mes',
    category: 'Jazz',
    title: 'Quarteto Bambu',
    presenter: 'Jazz no Terraço',
    tagline: 'Standards, choro e improviso a 18 andares do chão.',
    startsAt: '2026-10-30T21:00:00-03:00',
    doorsOpenAt: '2026-10-30T20:00:00-03:00',
    durationLabel: '2 horas, com intervalo',
    ageRating: '18 anos',
    venue: {
      name: 'Terraço Gravura',
      address: 'Av. São João, 439, Centro',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1415201364774-f6f0bb35f28f'),
      alt: 'Músico tocando saxofone',
      tone: 'gold',
      layout: 'title-top',
      creditUrl: 'https://unsplash.com/photos/dBWvUqBoOU8',
    },
    description:
      'O quarteto mistura standards americanos com choro e frevo, sempre com espaço para o improviso. Mesas ao ar livre, com vista para o centro.',
    story: [
      'O Quarteto Bambu se conheceu tocando em casamentos. Nos intervalos, entre uma valsa e outra, os quatro improvisavam em cima de choros antigos, e o público dos casamentos começou a pedir mais disso do que da valsa.',
      'No terraço, o show é dividido em dois sets: o primeiro mais calmo, para o pôr do sol, e o segundo mais acelerado, quando a cidade já está acesa.',
    ],
    lineup: [
      { name: 'Raul Siqueira', role: 'Saxofone' },
      { name: 'Ana Quintela', role: 'Piano' },
      { name: 'Davi Okoye', role: 'Contrabaixo' },
      { name: 'Lúcia Fontes', role: 'Bateria' },
    ],
    tiers: [
      {
        id: 'em-pe',
        name: 'Em pé',
        description: 'Área do bar, sem lugar reservado.',
        priceCents: 6000,
        capacity: 150,
        sold: 40,
      },
      {
        id: 'mesa',
        name: 'Mesa',
        description: 'Valor por pessoa. Mesas para até quatro pessoas.',
        priceCents: 11000,
        capacity: 64,
        sold: 56,
      },
    ],
  },
  {
    id: 'corpo-em-brasa',
    highlight: 'mes',
    category: 'Dança',
    title: 'Corpo em Brasa',
    presenter: 'Cia. Ventania',
    tagline: 'Doze bailarinos, uma fogueira no centro do palco e nenhuma palavra.',
    startsAt: '2026-11-06T20:00:00-03:00',
    doorsOpenAt: '2026-11-06T19:30:00-03:00',
    durationLabel: '55 minutos',
    ageRating: 'Livre',
    venue: {
      name: 'Teatro Alvorada',
      address: 'Praça Ramos de Azevedo, 22, Centro',
      city: 'São Paulo',
    },
    poster: {
      src: unsplash('1529229504105-4ea795dcbf59'),
      alt: 'Bailarina em movimento, borrada pela longa exposição',
      tone: 'red',
      layout: 'title-top',
      creditUrl: 'https://unsplash.com/photos/KHipnBn7sdY',
    },
    description:
      'Espetáculo de dança contemporânea inspirado nas festas de fogueira do interior, com trilha tocada ao vivo por percussão e rabeca.',
    story: [
      'A coreógrafa Iara Nunes passou dois anos acompanhando festas juninas em cidades pequenas do Nordeste. "Corpo em Brasa" junta o que ela viu: o círculo em volta do fogo, o passo que se repete até virar transe, o silêncio quando a fogueira apaga.',
      'A luz do espetáculo vem quase toda de uma única fonte no centro do palco, que muda de intensidade com a música.',
    ],
    lineup: [
      { name: 'Cia. Ventania', role: '12 bailarinos' },
      { name: 'Iara Nunes', role: 'Coreografia' },
      { name: 'Zé da Rabeca', role: 'Trilha ao vivo' },
    ],
    tiers: [
      {
        id: 'plateia',
        name: 'Plateia',
        description: 'Inteira. Lugar marcado.',
        priceCents: 8000,
        capacity: 400,
        sold: 150,
      },
      {
        id: 'meia',
        name: 'Plateia · Meia-entrada',
        description: 'Estudantes, professores e maiores de 60 anos, com comprovante.',
        priceCents: 4000,
        capacity: 120,
        sold: 60,
      },
    ],
  },
]
