/**
 * DADOS DE EXEMPLO. Projeto de estudo: eventos, artistas, locais e números de venda
 * abaixo são fictícios. Estes eventos não estão em destaque: aparecem só na listagem.
 *
 * Fotos: Unsplash (licença Unsplash), com crédito em `poster.creditUrl`.
 */
import type { FeaturedEvent, PosterLayout, PosterTone, TicketTier } from './featured-events'

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=78`

type Seed = {
  id: string
  category: string
  title: string
  presenter: string
  tagline: string
  startsAt: string
  doorsMinutesBefore: number
  durationLabel: string
  ageRating: string
  venue: FeaturedEvent['venue']
  photo: { id: string; credit: string; alt: string }
  tone: PosterTone
  layout: PosterLayout
  description: string
  story: Array<string>
  lineup: FeaturedEvent['lineup']
  tiers: Array<TicketTier>
}

function doorsOpen(startsAt: string, minutes: number): string {
  const start = new Date(startsAt).getTime()
  const doors = new Date(start - minutes * 60_000)
  // Mantém o fuso de São Paulo (-03:00) no texto ISO.
  const local = new Date(doors.getTime() - 3 * 3_600_000).toISOString().slice(0, 19)
  return `${local}-03:00`
}

const build = (seed: Seed): FeaturedEvent => ({
  id: seed.id,
  category: seed.category,
  title: seed.title,
  presenter: seed.presenter,
  tagline: seed.tagline,
  startsAt: seed.startsAt,
  doorsOpenAt: doorsOpen(seed.startsAt, seed.doorsMinutesBefore),
  durationLabel: seed.durationLabel,
  ageRating: seed.ageRating,
  venue: seed.venue,
  poster: {
    src: unsplash(seed.photo.id),
    alt: seed.photo.alt,
    tone: seed.tone,
    layout: seed.layout,
    creditUrl: `https://unsplash.com/photos/${seed.photo.credit}`,
  },
  description: seed.description,
  story: seed.story,
  lineup: seed.lineup,
  tiers: seed.tiers,
})

const SP = 'São Paulo'

export const moreEvents: Array<FeaturedEvent> = [
  build({
    id: 'noite-eletrica',
    category: 'Eletrônica',
    title: 'Noite Elétrica',
    presenter: 'DJ Kaio Nébula',
    tagline: 'Seis horas de techno num galpão sem relógio na parede.',
    startsAt: '2026-10-11T23:00:00-03:00',
    doorsMinutesBefore: 30,
    durationLabel: '6 horas',
    ageRating: '18 anos',
    venue: { name: 'Clube Vértice', address: 'Rua do Bucolismo, 81, Brás', city: SP },
    photo: { id: '1470225620780-dba8ba36b745', credit: 'YrtFlrLo2DQ', alt: 'Silhueta de DJ diante de uma mesa iluminada de vermelho' },
    tone: 'red',
    layout: 'title-bottom',
    description: 'Festa de techno e house com sistema de som montado para a pista, sem palco: o DJ fica no meio do público.',
    story: [
      'Kaio Nébula começou tocando em festas de garagem na zona leste. A Noite Elétrica é a festa que ele queria frequentar e não encontrava: pista escura, som alto e nenhuma tela.',
      'A cabine fica no centro do galpão, e a luz é só vermelha. Celulares ganham um adesivo na câmera na entrada.',
    ],
    lineup: [
      { name: 'Kaio Nébula', role: 'DJ, set de encerramento' },
      { name: 'Bruma', role: 'DJ, abertura' },
    ],
    tiers: [
      { id: 'pista', name: 'Pista', description: 'Acesso a todo o galpão.', priceCents: 7000, capacity: 900, sold: 520 },
      { id: 'pista-lote-1', name: 'Pista · 1º lote', description: 'Mesmo acesso, preço de pré-venda.', priceCents: 5000, capacity: 200, sold: 200 },
    ],
  }),
  build({
    id: 'vivaldi-a-luz-de-velas',
    category: 'Clássico',
    title: 'Vivaldi à Luz de Velas',
    presenter: 'Orquestra de Câmara Aurora',
    tagline: 'As Quatro Estações, com a sala iluminada só por velas.',
    startsAt: '2026-10-14T20:00:00-03:00',
    doorsMinutesBefore: 45,
    durationLabel: '1 hora e 15 minutos',
    ageRating: 'Livre',
    venue: { name: 'Cine Teatro Marajó', address: 'Rua Conselheiro Nébias, 340, Campos Elíseos', city: SP },
    photo: { id: '1465847899084-d164df4dedc6', credit: 'slbOcNlWNHA', alt: 'Violinistas tocando numa sala à meia-luz' },
    tone: 'gold',
    layout: 'title-top',
    description: 'Concerto de câmara com doze músicos tocando o ciclo completo das Quatro Estações, com mil velas de LED espalhadas pelo palco.',
    story: [
      'A Orquestra Aurora nasceu de um grupo de alunos de conservatório que tocava em igrejas do centro. O formato à luz de velas começou por acaso, num dia de falta de energia, e nunca mais saiu do repertório.',
      'Entre cada estação, a regente conta em poucas palavras o poema que Vivaldi escreveu para aquela parte.',
    ],
    lineup: [
      { name: 'Orquestra de Câmara Aurora', role: '12 músicos' },
      { name: 'Beatriz Lacerda', role: 'Violino solista' },
      { name: 'Helena Moura', role: 'Regência' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Inteira. Lugar marcado.', priceCents: 12000, capacity: 300, sold: 210 },
      { id: 'meia', name: 'Plateia · Meia-entrada', description: 'Estudantes, professores e maiores de 60 anos, com comprovante.', priceCents: 6000, capacity: 100, sold: 97 },
    ],
  }),
  build({
    id: 'forro-de-candeeiro',
    category: 'Forró',
    title: 'Forró de Candeeiro',
    presenter: 'Rosa do Agreste',
    tagline: 'Sanfona, zabumba e triângulo até o salão ficar sem chão.',
    startsAt: '2026-10-18T21:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '4 horas',
    ageRating: '16 anos',
    venue: { name: 'Lona Cultural Leste', address: 'Av. Itaquera, 2900, Itaquera', city: SP },
    photo: { id: '1615646352660-36b6da25882f', credit: '8RPXYhkkdi0', alt: 'Mulher de vestido vermelho tocando sanfona' },
    tone: 'red',
    layout: 'title-bottom',
    description: 'Baile de forró pé de serra com trio tradicional e aula aberta de dança na primeira hora.',
    story: [
      'Rosa aprendeu sanfona com o pai em Caruaru e chegou a São Paulo tocando em festas de bairro. O nome do baile vem do candeeiro que ela pendura no palco em todo show.',
      'Na primeira hora, o salão vira aula: quem nunca dançou forró sai sabendo o básico do xote.',
    ],
    lineup: [
      { name: 'Rosa do Agreste', role: 'Voz e sanfona' },
      { name: 'Tonho Bezerra', role: 'Zabumba' },
      { name: 'Miúda', role: 'Triângulo' },
    ],
    tiers: [
      { id: 'salao', name: 'Salão', description: 'Acesso ao salão de dança.', priceCents: 4000, capacity: 600, sold: 230 },
      { id: 'casal', name: 'Salão · Casal', description: 'Dois ingressos. Valor por pessoa.', priceCents: 3500, capacity: 200, sold: 140 },
    ],
  }),
  build({
    id: 'voo-livre',
    category: 'Circo',
    title: 'Voo Livre',
    presenter: 'Trupe Gravidade',
    tagline: 'Acrobacia aérea a oito metros do chão, sem rede embaixo do lustre.',
    startsAt: '2026-10-24T16:00:00-03:00',
    doorsMinutesBefore: 45,
    durationLabel: '1 hora e 20 minutos',
    ageRating: 'Livre',
    venue: { name: 'Lona Cultural Leste', address: 'Av. Itaquera, 2900, Itaquera', city: SP },
    photo: { id: '1645287642975-fb04fa89347a', credit: 'Ru2skNA-sk8', alt: 'Acrobata se apresentando suspensa num mastro' },
    tone: 'night',
    layout: 'title-top',
    description: 'Espetáculo de circo contemporâneo com tecido, trapézio e mastro chinês, para toda a família.',
    story: [
      'A Trupe Gravidade junta acrobatas formados em escolas de circo de São Paulo e Belo Horizonte. "Voo Livre" conta, sem palavras, a história de uma menina que aprende a não ter medo de altura.',
      'Sessões à tarde, pensadas para crianças, com intervalo curto e luz da lona acesa entre os números.',
    ],
    lineup: [
      { name: 'Trupe Gravidade', role: '8 acrobatas' },
      { name: 'Nina Fontoura', role: 'Direção' },
    ],
    tiers: [
      { id: 'arquibancada', name: 'Arquibancada', description: 'Lugar livre na arquibancada.', priceCents: 6000, capacity: 500, sold: 180 },
      { id: 'crianca', name: 'Criança até 12 anos', description: 'Acompanhada de um adulto pagante.', priceCents: 3000, capacity: 200, sold: 75 },
    ],
  }),
  build({
    id: 'festival-asfalto-quente',
    category: 'Festival',
    title: 'Asfalto Quente',
    presenter: 'Festival de bandas independentes',
    tagline: 'Dez bandas, dois palcos e um viaduto fechado para carros.',
    startsAt: '2026-10-31T14:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '10 horas',
    ageRating: '16 anos',
    venue: { name: 'Arena Viaduto', address: 'Av. Tiradentes, 1500, Luz', city: SP },
    photo: { id: '1470229722913-7c0e2dbbafd3', credit: 'NYrVisodQ2M', alt: 'Luzes de palco sobre a plateia de um show' },
    tone: 'night',
    layout: 'title-bottom',
    description: 'Festival de um dia com bandas independentes de rock, pop e música brasileira, alternando entre dois palcos.',
    story: [
      'O Asfalto Quente começou em 2019 como um show de três bandas de amigos debaixo do viaduto. Hoje ocupa a arena inteira, mas mantém a regra: só bandas que ainda não assinaram com gravadora.',
      'Os palcos ficam frente a frente. Quando uma banda termina, a outra começa do lado oposto e o público só precisa se virar.',
    ],
    lineup: [
      { name: 'Cais', role: 'Palco Norte' },
      { name: 'Vera Cruz Elétrica', role: 'Palco Sul' },
      { name: 'Os Inquilinos', role: 'Palco Norte' },
      { name: 'Mais 7 bandas', role: 'Programação completa no dia' },
    ],
    tiers: [
      { id: 'dia', name: 'Passaporte do dia', description: 'Acesso aos dois palcos.', priceCents: 18000, capacity: 3000, sold: 2140 },
      { id: 'meia', name: 'Meia-entrada', description: 'Estudantes, professores e maiores de 60 anos, com comprovante.', priceCents: 9000, capacity: 800, sold: 790 },
    ],
  }),
  build({
    id: 'rafa-duarte',
    category: 'MPB',
    title: 'Voz e Violão',
    presenter: 'Rafa Duarte',
    tagline: 'As canções do primeiro disco, do jeito que foram compostas: só voz e violão.',
    startsAt: '2026-11-01T19:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '1 hora e 30 minutos',
    ageRating: '12 anos',
    venue: { name: 'Teatro Rubi', address: 'Rua Barão de Itaipu, 87, Bela Vista', city: SP },
    photo: { id: '1620577610365-86c411bad78d', credit: 'uGh-hHVPRYI', alt: 'Cantor no palco diante da plateia' },
    tone: 'gold',
    layout: 'title-bottom',
    description: 'Show intimista de MPB com repertório autoral e algumas releituras pedidas pelo público na hora.',
    story: [
      'Rafa compôs o primeiro disco num quarto alugado em Salvador, com um violão emprestado. Este show devolve as músicas ao formato original, antes dos arranjos de estúdio.',
      'No meio do show, ele abre espaço para três pedidos da plateia, escritos em papel na entrada.',
    ],
    lineup: [{ name: 'Rafa Duarte', role: 'Voz e violão' }],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Inteira. Lugar marcado.', priceCents: 9000, capacity: 220, sold: 160 },
      { id: 'balcao', name: 'Balcão', description: 'Primeiro andar.', priceCents: 6000, capacity: 80, sold: 22 },
    ],
  }),
  build({
    id: 'blues-da-estacao',
    category: 'Blues',
    title: 'Blues da Estação',
    presenter: 'Zé Ferrugem & Banda',
    tagline: 'Guitarra suja, gaita e as histórias de quem viveu de trem.',
    startsAt: '2026-11-05T21:30:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '2 horas',
    ageRating: '18 anos',
    venue: { name: 'Casa Estopim', address: 'Rua Augusta, 2150, Jardins', city: SP },
    photo: { id: '1503528108408-87b0d1c2b785', credit: 'YaYcCW1nlqc', alt: 'Foto em preto e branco de um homem tocando guitarra' },
    tone: 'night',
    layout: 'title-top',
    description: 'Noite de blues elétrico com repertório próprio e clássicos do gênero, no porão da Casa Estopim.',
    story: [
      'Zé Ferrugem foi ferroviário por 20 anos antes de viver de música. As letras falam das linhas que fecharam e das cidades que ficaram sem estação.',
      'A banda toca no chão, sem palco, no mesmo nível das mesas.',
    ],
    lineup: [
      { name: 'Zé Ferrugem', role: 'Voz e guitarra' },
      { name: 'Lúcio Gaita', role: 'Gaita' },
      { name: 'Banda da Estação', role: 'Baixo e bateria' },
    ],
    tiers: [
      { id: 'mesa', name: 'Mesa', description: 'Valor por pessoa.', priceCents: 9000, capacity: 80, sold: 74 },
      { id: 'em-pe', name: 'Em pé', description: 'Área do bar.', priceCents: 5000, capacity: 120, sold: 40 },
    ],
  }),
  build({
    id: 'o-lago',
    category: 'Balé',
    title: 'O Lago',
    presenter: 'Balé da Cidade Nova',
    tagline: 'O Lago dos Cisnes recontado numa represa da periferia.',
    startsAt: '2026-11-07T20:00:00-03:00',
    doorsMinutesBefore: 30,
    durationLabel: '1 hora e 50 minutos, com intervalo',
    ageRating: 'Livre',
    venue: { name: 'Teatro Alvorada', address: 'Praça Ramos de Azevedo, 22, Centro', city: SP },
    photo: { id: '1547153760-18fc86324498', credit: 'LsMxdW1zWEQ', alt: 'Bailarina dançando no palco' },
    tone: 'gold',
    layout: 'title-top',
    description: 'Releitura contemporânea do clássico de Tchaikovsky, com a trilha original tocada por gravação e coreografia nova.',
    story: [
      'A companhia trocou o lago encantado por uma represa onde os moradores do bairro iam nadar nos anos 80. Os cisnes viraram as meninas que dançavam na beira da água.',
      'A música é a de Tchaikovsky, inteira. O que muda é tudo o que está em cena.',
    ],
    lineup: [
      { name: 'Balé da Cidade Nova', role: '20 bailarinos' },
      { name: 'Clara Seixas', role: 'Coreografia' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Inteira. Lugar marcado.', priceCents: 10000, capacity: 400, sold: 260 },
      { id: 'meia', name: 'Plateia · Meia-entrada', description: 'Estudantes, professores e maiores de 60 anos, com comprovante.', priceCents: 5000, capacity: 120, sold: 64 },
    ],
  }),
  build({
    id: 'baile-do-passinho',
    category: 'Funk',
    title: 'Baile do Passinho',
    presenter: 'Coletivo Quebrada em Movimento',
    tagline: 'Batalha de passinho com júri da comunidade e baile até de manhã.',
    startsAt: '2026-11-13T22:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '5 horas',
    ageRating: '18 anos',
    venue: { name: 'Galpão Fábrica', address: 'Rua dos Trilhos, 1200, Mooca', city: SP },
    photo: { id: '1533106958148-daaeab8b83fe', credit: 'TK_WT3dl2tw', alt: 'Grupo de pessoas dançando' },
    tone: 'red',
    layout: 'title-bottom',
    description: 'Baile funk com batalha de passinho na primeira parte e DJs da quebrada na segunda.',
    story: [
      'O Coletivo Quebrada em Movimento organiza batalhas de dança em praças da zona sul desde 2017. O baile é a final do circuito do ano.',
      'Quem julga a batalha é o público, com cartões verdes e vermelhos distribuídos na entrada.',
    ],
    lineup: [
      { name: '16 dançarinos', role: 'Finalistas da batalha' },
      { name: 'DJ Marola', role: 'Baile' },
      { name: 'DJ Tieta', role: 'Baile' },
    ],
    tiers: [
      { id: 'pista', name: 'Pista', description: 'Acesso a todo o galpão.', priceCents: 4000, capacity: 1000, sold: 610 },
      { id: 'camarote', name: 'Camarote', description: 'Mezanino com vista da batalha.', priceCents: 12000, capacity: 100, sold: 96 },
    ],
  }),
  build({
    id: 'fanfarra-ceu-aberto',
    category: 'Instrumental',
    title: 'Fanfarra Céu Aberto',
    presenter: 'Banda de metais da Vila',
    tagline: 'Vinte metais tocando frevo, marchinha e pop no meio da plateia.',
    startsAt: '2026-11-15T17:00:00-03:00',
    doorsMinutesBefore: 30,
    durationLabel: '1 hora e 40 minutos',
    ageRating: 'Livre',
    venue: { name: 'Terraço Gravura', address: 'Av. São João, 439, Centro', city: SP },
    photo: { id: '1559752067-f30e5f277930', credit: 'V3u2hyLPbaM', alt: 'Mulher tocando trompete' },
    tone: 'red',
    layout: 'title-top',
    description: 'Show de fanfarra ao ar livre, com a banda saindo do palco para tocar andando entre o público.',
    story: [
      'A fanfarra começou como banda de bloco de carnaval e foi ficando: hoje ensaia o ano todo, com músicos de 14 a 70 anos.',
      'O show termina com a banda descendo do terraço e tocando a última música na calçada.',
    ],
    lineup: [
      { name: 'Banda de metais da Vila', role: '20 músicos' },
      { name: 'Jussara Telles', role: 'Regência e trompete' },
    ],
    tiers: [
      { id: 'em-pe', name: 'Em pé', description: 'Área livre do terraço.', priceCents: 3500, capacity: 400, sold: 120 },
    ],
  }),
  build({
    id: 'trio-fuba',
    category: 'Choro',
    title: 'Trio Fubá',
    presenter: 'Roda de choro',
    tagline: 'Pixinguinha, Jacob e choros novos, tocados em roda no centro do salão.',
    startsAt: '2026-11-20T20:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '2 horas',
    ageRating: 'Livre',
    venue: { name: 'Cine Teatro Marajó', address: 'Rua Conselheiro Nébias, 340, Campos Elíseos', city: SP },
    photo: { id: '1526478806334-5fd488fcaabc', credit: '_uDj_lyPVpA', alt: 'Três músicos tocando instrumentos no palco' },
    tone: 'gold',
    layout: 'title-bottom',
    description: 'Roda de choro com bandolim, violão de sete cordas e pandeiro, aberta a músicos da plateia no último bloco.',
    story: [
      'O Trio Fubá toca junto há quinze anos, sempre em roda. No palco, eles mantêm o formato: três cadeiras viradas uma para a outra.',
      'No último bloco, quem levou instrumento pode subir e entrar na roda.',
    ],
    lineup: [
      { name: 'Celso Maia', role: 'Bandolim' },
      { name: 'Tereza Prado', role: 'Violão de sete cordas' },
      { name: 'Bené', role: 'Pandeiro' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Lugar livre.', priceCents: 5000, capacity: 260, sold: 90 },
    ],
  }),
  build({
    id: 'vermelho',
    category: 'Pop',
    title: 'Vermelho',
    presenter: 'Lia Sombra',
    tagline: 'O show do disco novo, com o palco inteiro pintado de uma cor só.',
    startsAt: '2026-11-21T21:00:00-03:00',
    doorsMinutesBefore: 90,
    durationLabel: '1 hora e 45 minutos',
    ageRating: '14 anos',
    venue: { name: 'Arena Viaduto', address: 'Av. Tiradentes, 1500, Luz', city: SP },
    photo: { id: '1637961239771-6578d3eb8d8e', credit: 'xgEK5TZ7rME', alt: 'Mulher num quarto escuro iluminado por luz vermelha' },
    tone: 'night',
    layout: 'title-bottom',
    description: 'Show de lançamento do segundo disco de Lia Sombra, com banda completa e cenografia em vermelho.',
    story: [
      'Lia ficou conhecida cantando com o Sereno de Lua, mas o disco solo vai para outro lado: pop eletrônico, com letras sobre a cidade à noite.',
      'Cada música do show tem uma luz própria, mas todas são vermelhas, em tons diferentes.',
    ],
    lineup: [
      { name: 'Lia Sombra', role: 'Voz' },
      { name: 'Banda Vermelha', role: 'Synths, baixo e bateria' },
    ],
    tiers: [
      { id: 'pista', name: 'Pista', description: 'Em pé, acesso à pista geral.', priceCents: 16000, capacity: 1500, sold: 980 },
      { id: 'pista-frente', name: 'Pista Frente', description: 'Área junto à grade do palco.', priceCents: 24000, capacity: 300, sold: 300 },
    ],
  }),
  build({
    id: 'o-casamento-do-ano',
    category: 'Comédia',
    title: 'O Casamento do Ano',
    presenter: 'Cia. Riso Frouxo',
    tagline: 'Duas famílias, um bufê errado e uma noiva que sumiu antes do bolo.',
    startsAt: '2026-11-27T21:00:00-03:00',
    doorsMinutesBefore: 30,
    durationLabel: '1 hora e 30 minutos',
    ageRating: '12 anos',
    venue: { name: 'Teatro Rubi', address: 'Rua Barão de Itaipu, 87, Bela Vista', city: SP },
    photo: { id: '1514306191717-452ec28c7814', credit: 'WW1jsInXgwM', alt: 'Cortina vermelha de teatro' },
    tone: 'red',
    layout: 'title-top',
    description: 'Comédia de costumes em que tudo dá errado no casamento mais caro do bairro.',
    story: [
      'A Cia. Riso Frouxo escreveu a peça a partir de histórias reais de casamentos contadas pelo público em sessões anteriores.',
      'Cada sessão tem uma pequena parte improvisada, a partir de uma sugestão da plateia.',
    ],
    lineup: [
      { name: 'Cia. Riso Frouxo', role: '7 atores' },
      { name: 'Paulo Arantes', role: 'Texto e direção' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Inteira. Lugar marcado.', priceCents: 8000, capacity: 220, sold: 130 },
      { id: 'meia', name: 'Plateia · Meia-entrada', description: 'Estudantes, professores e maiores de 60 anos, com comprovante.', priceCents: 4000, capacity: 100, sold: 52 },
    ],
  }),
  build({
    id: 'sala-de-espera',
    category: 'Teatro',
    title: 'Sala de Espera',
    presenter: 'Coletivo Penumbra',
    tagline: 'Cinco desconhecidos esperam um nome que ninguém chama.',
    startsAt: '2026-12-04T20:00:00-03:00',
    doorsMinutesBefore: 30,
    durationLabel: '1 hora e 20 minutos',
    ageRating: '14 anos',
    venue: { name: 'Teatro Alvorada', address: 'Praça Ramos de Azevedo, 22, Centro', city: SP },
    photo: { id: '1558970439-add78fc68990', credit: 'jhPSJDhiRyQ', alt: 'Palco com cadeiras e mesas sob refletores azuis' },
    tone: 'night',
    layout: 'title-bottom',
    description: 'Drama contemporâneo sobre espera, burocracia e as conversas que surgem entre estranhos.',
    story: [
      'O Coletivo Penumbra passou um mês sentado em salas de espera de repartições públicas, anotando conversas. O texto saiu dessas anotações.',
      'O público senta em cadeiras iguais às do cenário, na mesma fileira dos atores.',
    ],
    lineup: [
      { name: 'Coletivo Penumbra', role: '5 atores' },
      { name: 'Rita Galvão', role: 'Direção' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Lugar livre, junto ao cenário.', priceCents: 7000, capacity: 90, sold: 81 },
    ],
  }),
  build({
    id: 'slam-da-laje',
    category: 'Poesia',
    title: 'Slam da Laje',
    presenter: 'Final do campeonato',
    tagline: 'Três minutos, nenhum adereço e a cidade inteira dentro de um poema.',
    startsAt: '2026-12-12T19:00:00-03:00',
    doorsMinutesBefore: 60,
    durationLabel: '3 horas',
    ageRating: '14 anos',
    venue: { name: 'Casa Estopim', address: 'Rua Augusta, 2150, Jardins', city: SP },
    photo: { id: '1559322622-95aeeddf3b5e', credit: 'JGGHEj9ExQs', alt: 'Homem sozinho em pé no palco' },
    tone: 'gold',
    layout: 'title-top',
    description: 'Final do campeonato de poesia falada, com dezesseis poetas e júri sorteado na plateia.',
    story: [
      'O Slam da Laje começou numa laje da Brasilândia, com um microfone ligado numa caixa de som de bicicleta. A final do ano é a única noite em que ele sai do bairro.',
      'Cada poeta tem três minutos. O júri é formado por cinco pessoas sorteadas entre o público.',
    ],
    lineup: [
      { name: '16 poetas', role: 'Finalistas do ano' },
      { name: 'Mestra Odete', role: 'Apresentação' },
    ],
    tiers: [
      { id: 'plateia', name: 'Plateia', description: 'Lugar livre.', priceCents: 2000, capacity: 240, sold: 150 },
    ],
  }),
]
