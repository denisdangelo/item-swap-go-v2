import type { Category, Item, User } from '@/types';

// Mock de usuários com fotos reais
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    rating: 4.8,
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      city: 'São Paulo',
      state: 'SP',
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    rating: 4.5,
    location: {
      latitude: -23.56052,
      longitude: -46.643308,
      city: 'São Paulo',
      state: 'SP',
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    rating: 4.9,
    location: {
      latitude: -23.57052,
      longitude: -46.653308,
      city: 'São Paulo',
      state: 'SP',
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@example.com',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    rating: 4.7,
    location: {
      latitude: -23.58052,
      longitude: -46.663308,
      city: 'São Paulo',
      state: 'SP',
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    email: 'carlos@example.com',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    rating: 4.6,
    location: {
      latitude: -23.59052,
      longitude: -46.673308,
      city: 'São Paulo',
      state: 'SP',
      address: 'São Paulo, SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock de categorias
export const MOCK_CATEGORIES: Category[] = [
  { id: 'ferramentas', name: 'Ferramentas', icon: '🔧', color: '#FF6B6B' },
  { id: 'eletronicos', name: 'Eletrônicos', icon: '💻', color: '#4ECDC4' },
  { id: 'eletrodomesticos', name: 'Eletrodomésticos', icon: '🏠', color: '#45B7D1' },
  { id: 'esportes', name: 'Esportes', icon: '🏄‍♂️', color: '#96CEB4' },
  { id: 'livros', name: 'Livros', icon: '📚', color: '#FFEEAD' },
  { id: 'moveis', name: 'Móveis', icon: '🪑', color: '#DDA0DD' },
  { id: 'escritorio', name: 'Escritório', icon: '🖥️', color: '#98FB98' },
  { id: 'lazer', name: 'Lazer', icon: '🏖️', color: '#87CEEB' },
  { id: 'acessibilidade', name: 'Acessibilidade (PCD)', icon: '♿', color: '#F0E68C' },
];

// Dados base dos itens atualizados baseados nas novas imagens
const ITEMS_DATA = [
  // FERRAMENTAS (5 produtos)
  {
    id: '1',
    title: 'Parafusadeira',
    description:
      'Parafusadeira elétrica sem fio com bateria de lítio. Inclui kit de bits e maleta organizadora para trabalhos profissionais.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'ferramentas',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Serra Mármore',
    description:
      'Serra mármore profissional 1400W para cortes precisos em mármore, granito e cerâmica. Inclui disco diamantado.',
    price: 25,
    period: 'dia' as const,
    categoryId: 'ferramentas',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-02T11:30:00Z',
    updatedAt: '2024-03-05T15:20:00Z',
  },
  {
    id: '3',
    title: 'Martelete',
    description:
      'Martelete perfurador e rompedor 800W com sistema SDS. Ideal para furos em concreto e demolições leves.',
    price: 30,
    period: 'dia' as const,
    categoryId: 'ferramentas',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-03T09:15:00Z',
    updatedAt: '2024-03-06T10:45:00Z',
  },
  {
    id: '4',
    title: 'Trena',
    description:
      'Trena digital a laser com alcance de 40m. Medição precisa com display LCD e função de memória.',
    price: 12,
    period: 'dia' as const,
    categoryId: 'ferramentas',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-04T14:20:00Z',
    updatedAt: '2024-03-04T14:20:00Z',
  },
  {
    id: '5',
    title: 'Compressor',
    description:
      'Compressor de ar 2HP, tanque 50L, com pistola de pintura e kit de mangueiras. Perfeito para pintura e limpeza.',
    price: 35,
    period: 'dia' as const,
    categoryId: 'ferramentas',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-03-07T09:30:00Z',
  },

  // ELETRÔNICOS (2 produtos)
  {
    id: '6',
    title: 'Caixa de Som',
    description:
      'Caixa de som Bluetooth portátil com bateria de 12h. Som de alta qualidade, resistente à água IPX7.',
    price: 20,
    period: 'dia' as const,
    categoryId: 'eletronicos',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-06T10:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
  },
  {
    id: '7',
    title: 'Notebook',
    description:
      'Notebook Intel i5, 8GB RAM, 256GB SSD. Tela 15.6", em ótimo estado com carregador e case protetora.',
    price: 40,
    period: 'dia' as const,
    categoryId: 'eletronicos',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-07T11:30:00Z',
    updatedAt: '2024-03-07T11:30:00Z',
  },

  // ELETRODOMÉSTICOS (4 produtos)
  {
    id: '8',
    title: 'Liquidificador',
    description:
      'Liquidificador potente 1000W com 12 velocidades. Copo de vidro temperado e lâminas em aço inox.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'eletrodomesticos',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-08T09:15:00Z',
    updatedAt: '2024-03-08T09:15:00Z',
  },
  {
    id: '9',
    title: 'Forno Elétrico',
    description:
      'Forno elétrico 45L com timer digital e controle de temperatura. Ideal para assar, gratinar e aquecer.',
    price: 25,
    period: 'dia' as const,
    categoryId: 'eletrodomesticos',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-09T14:20:00Z',
    updatedAt: '2024-03-09T14:20:00Z',
  },
  {
    id: '10',
    title: 'Batedeira',
    description:
      'Batedeira planetária 5L com 3 batedores diferentes. Motor potente, perfeita para massas e cremes.',
    price: 20,
    period: 'dia' as const,
    categoryId: 'eletrodomesticos',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-10T16:45:00Z',
    updatedAt: '2024-03-10T16:45:00Z',
  },
  {
    id: '11',
    title: 'Secador',
    description:
      'Secador profissional 2000W com 3 temperaturas e 2 velocidades. Inclui difusor e concentrador.',
    price: 18,
    period: 'dia' as const,
    categoryId: 'eletrodomesticos',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-11T10:00:00Z',
    updatedAt: '2024-03-11T10:00:00Z',
  },
  {
    id: '12',
    title: 'Chapinha',
    description:
      'Chapinha profissional com placas de cerâmica e turmalina. Aquecimento rápido e controle de temperatura.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'eletrodomesticos',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-12T11:30:00Z',
    updatedAt: '2024-03-12T11:30:00Z',
  },

  // ESPORTES (3 produtos)
  {
    id: '13',
    title: 'Prancha de Surf',
    description:
      'Prancha de surf 6.2" em epoxy, com leash e parafina inclusos. Ideal para iniciantes e intermediários.',
    price: 30,
    period: 'dia' as const,
    categoryId: 'esportes',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z',
  },
  {
    id: '14',
    title: 'Bodyboard',
    description:
      'Bodyboard profissional 42" com deck antiderrapante e leash. Perfeito para ondas pequenas e médias.',
    price: 20,
    period: 'dia' as const,
    categoryId: 'esportes',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-14T14:20:00Z',
    updatedAt: '2024-03-14T14:20:00Z',
  },
  {
    id: '15',
    title: 'Snorkel',
    description:
      'Kit completo de snorkel com máscara de vidro temperado, respirador e nadadeiras ajustáveis.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'esportes',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-15T16:45:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },

  // LIVROS (5 produtos)
  {
    id: '16',
    title: 'Livros de Medicina',
    description:
      'Coleção de livros médicos atualizados. Anatomia, fisiologia, patologia e clínica médica. 12 volumes.',
    price: 12,
    period: 'semana' as const,
    categoryId: 'livros',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
  },
  {
    id: '17',
    title: 'Livros Nutricionais',
    description:
      'Coleção sobre nutrição e alimentação saudável. Inclui guias práticos, receitas e planos alimentares.',
    price: 10,
    period: 'semana' as const,
    categoryId: 'livros',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-17T11:30:00Z',
    updatedAt: '2024-03-17T11:30:00Z',
  },
  {
    id: '18',
    title: 'Livros para Concursos',
    description:
      'Coleção completa para concursos públicos. Português, matemática, direito e conhecimentos gerais atualizados.',
    price: 15,
    period: 'semana' as const,
    categoryId: 'livros',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-18T09:15:00Z',
    updatedAt: '2024-03-18T09:15:00Z',
  },
  {
    id: '19',
    title: 'Livros de Direito',
    description:
      'Biblioteca jurídica atualizada. Direito civil, penal, trabalhista, constitucional e processual.',
    price: 20,
    period: 'semana' as const,
    categoryId: 'livros',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-19T14:20:00Z',
    updatedAt: '2024-03-19T14:20:00Z',
  },
  {
    id: '20',
    title: 'Livros Diversos',
    description:
      'Coleção variada com romances, biografias, autoajuda e ficção. Mais de 50 títulos de diversos gêneros.',
    price: 8,
    period: 'semana' as const,
    categoryId: 'livros',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-20T16:45:00Z',
    updatedAt: '2024-03-20T16:45:00Z',
  },

  // MÓVEIS (3 produtos)
  {
    id: '21',
    title: 'Sofá',
    description:
      'Sofá confortável 3 lugares em tecido, com almofadas soltas. Design moderno, perfeito para sala de estar.',
    price: 40,
    period: 'semana' as const,
    categoryId: 'moveis',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-21T10:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
  },
  {
    id: '22',
    title: 'Banquetas',
    description:
      'Conjunto de 4 banquetas modernas em madeira e metal. Altura regulável, ideais para balcão e cozinha.',
    price: 25,
    period: 'semana' as const,
    categoryId: 'moveis',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-22T11:30:00Z',
    updatedAt: '2024-03-22T11:30:00Z',
  },
  {
    id: '23',
    title: 'Mesa Dobrável',
    description:
      'Mesa dobrável para 6 pessoas em madeira maciça. Fácil montagem e armazenamento compacto.',
    price: 30,
    period: 'semana' as const,
    categoryId: 'moveis',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-23T09:15:00Z',
    updatedAt: '2024-03-23T09:15:00Z',
  },

  // ESCRITÓRIO (3 produtos)
  {
    id: '24',
    title: 'Cadeira de Escritório',
    description:
      'Cadeira ergonômica com apoio lombar, braços ajustáveis e rodízios. Perfeita para home office e trabalho.',
    price: 20,
    period: 'semana' as const,
    categoryId: 'escritorio',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-24T14:20:00Z',
    updatedAt: '2024-03-24T14:20:00Z',
  },
  {
    id: '25',
    title: 'Mesa de Escritório',
    description:
      'Mesa de escritório em L com gavetas e suporte para CPU. Ampla superfície, ideal para trabalho e estudos.',
    price: 35,
    period: 'semana' as const,
    categoryId: 'escritorio',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-25T16:45:00Z',
    updatedAt: '2024-03-25T16:45:00Z',
  },
  {
    id: '26',
    title: 'Climatizador',
    description:
      'Climatizador de ar portátil com controle remoto. Resfria, umidifica e purifica o ar do ambiente.',
    price: 25,
    period: 'dia' as const,
    categoryId: 'escritorio',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-26T10:00:00Z',
    updatedAt: '2024-03-26T10:00:00Z',
  },

  // LAZER (4 produtos)
  {
    id: '27',
    title: 'Guarda Sol',
    description:
      'Guarda-sol grande 2,5m com proteção UV 50+. Base robusta inclusa, ideal para praia e piscina.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'lazer',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-27T11:30:00Z',
    updatedAt: '2024-03-27T11:30:00Z',
  },
  {
    id: '28',
    title: 'Cadeira de Pesca',
    description:
      'Cadeira dobrável para pesca com porta-copo e compartimento térmico. Confortável e resistente.',
    price: 10,
    period: 'dia' as const,
    categoryId: 'lazer',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-28T09:15:00Z',
    updatedAt: '2024-03-28T09:15:00Z',
  },
  {
    id: '29',
    title: 'Boias',
    description:
      'Kit com 4 boias infláveis coloridas em diferentes formatos. Inclui bomba manual para inflar.',
    price: 8,
    period: 'dia' as const,
    categoryId: 'lazer',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-29T14:20:00Z',
    updatedAt: '2024-03-29T14:20:00Z',
  },
  {
    id: '30',
    title: 'Vara de Pescar',
    description:
      'Vara de pesca telescópica 2,7m com carretilha e kit completo de iscas. Perfeita para pesca em rios.',
    price: 18,
    period: 'dia' as const,
    categoryId: 'lazer',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-30T16:45:00Z',
    updatedAt: '2024-03-30T16:45:00Z',
  },

  // ACESSIBILIDADE (PCD) (6 produtos)
  {
    id: '31',
    title: 'Cadeira de Rodas',
    description:
      'Cadeira de rodas dobrável em alumínio, leve e resistente. Com freios de segurança e apoios removíveis.',
    price: 30,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-03-31T10:00:00Z',
    updatedAt: '2024-03-31T10:00:00Z',
  },
  {
    id: '32',
    title: 'Cadeira de Banho',
    description:
      'Cadeira para banho com encosto e braços. Base antiderrapante e altura ajustável para segurança.',
    price: 20,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '2',
    location: {
      latitude: -23.55792,
      longitude: -46.639818,
      address: 'Rua Oscar Freire, 500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-04-01T11:30:00Z',
    updatedAt: '2024-04-01T11:30:00Z',
  },
  {
    id: '33',
    title: 'Muletas',
    description:
      'Par de muletas reguláveis em alumínio com ponteiras antiderrapantes. Leves, resistentes e confortáveis.',
    price: 15,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '3',
    location: {
      latitude: -23.56292,
      longitude: -46.655818,
      address: 'Rua Haddock Lobo, 200, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-04-02T09:15:00Z',
    updatedAt: '2024-04-02T09:15:00Z',
  },
  {
    id: '34',
    title: 'Bengala',
    description:
      'Bengala dobrável em 4 partes com alça ergonômica. Fácil de transportar e guardar, muito resistente.',
    price: 10,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '4',
    location: {
      latitude: -23.56892,
      longitude: -46.669818,
      address: 'Rua Bela Cintra, 800, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-04-03T14:20:00Z',
    updatedAt: '2024-04-03T14:20:00Z',
  },
  {
    id: '35',
    title: 'Cadeira Infantil',
    description:
      'Cadeira de rodas infantil ajustável e segura. Desenvolvida especialmente para crianças com máximo conforto.',
    price: 25,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '5',
    location: {
      latitude: -23.57492,
      longitude: -46.683818,
      address: 'Rua da Consolação, 1500, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-04-04T16:45:00Z',
    updatedAt: '2024-04-04T16:45:00Z',
  },
  {
    id: '36',
    title: 'Berço Portátil',
    description:
      'Berço portátil dobrável com colchão incluso. Fácil montagem, seguro e confortável para bebês.',
    price: 20,
    period: 'dia' as const,
    categoryId: 'acessibilidade',
    ownerId: '1',
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'Rua Augusta, 1000, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
    },
    status: 'available' as const,
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-04-05T10:00:00Z',
  },
];

// Gerar itens com imagens locais
export const MOCK_ITEMS: Item[] = ITEMS_DATA.map((item) => {
  // Mapear os títulos para os nomes das imagens
  const imageMap: { [key: string]: { primary: string; carousel: string } } = {
    Parafusadeira: {
      primary: '/img/items/Parafusadeira Principal.png',
      carousel: '/img/items/Parafusadeira Carrossel¹.png',
    },
    'Serra Mármore': {
      primary: '/img/items/Serra Marmore Principal.png',
      carousel: '/img/items/Serra Marmore Carrossel¹.png',
    },
    Martelete: {
      primary: '/img/items/Martelete Principal.png',
      carousel: '/img/items/Martelete Carrossel¹.png',
    },
    Trena: {
      primary: '/img/items/Trena Principal.png',
      carousel: '/img/items/Trena Carrossel¹.png',
    },
    Compressor: {
      primary: '/img/items/Compressor Principal.png',
      carousel: '/img/items/Compressor Carrossel¹.png',
    },
    'Caixa de Som': {
      primary: '/img/items/Caixa de Som Principal.png',
      carousel: '/img/items/Caixa de Som Carrossel¹.png',
    },
    Notebook: {
      primary: '/img/items/Notebook Principal.png',
      carousel: '/img/items/Notebook Carrossel¹.png',
    },
    Liquidificador: {
      primary: '/img/items/Liquidificador Principal.png',
      carousel: '/img/items/Liquidificador Carrossel¹.png',
    },
    'Forno Elétrico': {
      primary: '/img/items/Forno Elétrico Principal.png',
      carousel: '/img/items/Forno Elétrico Carrossel¹.png',
    },
    Batedeira: {
      primary: '/img/items/Batedeira Principal.png',
      carousel: '/img/items/Batedeira Carrossel¹.png',
    },
    Secador: {
      primary: '/img/items/Secador Principal.png',
      carousel: '/img/items/Secador Carrossel¹.png',
    },
    Chapinha: {
      primary: '/img/items/Chapinha Principal.png',
      carousel: '/img/items/Chapinha Principal.png',
    },
    'Prancha de Surf': {
      primary: '/img/items/Prancha Surf Principal.png',
      carousel: '/img/items/Prancha de Surf Carrossel¹.png',
    },
    Bodyboard: {
      primary: '/img/items/Bodyboard Principal.png',
      carousel: '/img/items/Bodyboard Corrossel¹.png',
    },
    Snorkel: {
      primary: '/img/items/Snorkel Principal.png',
      carousel: '/img/items/Snorkel Carrossel¹.png',
    },
    'Livros de Medicina': {
      primary: '/img/items/Livros Medicina Principal.png',
      carousel: '/img/items/Livros Medicina Carrossel¹.png',
    },
    'Livros Nutricionais': {
      primary: '/img/items/Livro Nutricional.png',
      carousel: '/img/items/Livro Nutricional.png',
    },
    'Livros para Concursos': {
      primary: '/img/items/Livros Concursos Principal.png',
      carousel: '/img/items/Livros Concursos Principal.png',
    },
    'Livros de Direito': {
      primary: '/img/items/Livros Direito Principal.png',
      carousel: '/img/items/Livros Direito Principal.png',
    },
    'Livros Diversos': {
      primary: '/img/items/Livros Diversos Principal.png',
      carousel: '/img/items/Livros Diversos Principal.png',
    },
    Sofá: {
      primary: '/img/items/Sofá Principal.png',
      carousel: '/img/items/Sofá Carrossel¹.png',
    },
    Banquetas: {
      primary: '/img/items/Banquetas Principal.png',
      carousel: '/img/items/Banquetas Carrossel¹.png',
    },
    'Mesa Dobrável': {
      primary: '/img/items/Mesa Dobrável Principal.png',
      carousel: '/img/items/Mesa Dobrável Carrossel¹.png',
    },
    'Cadeira de Escritório': {
      primary: '/img/items/Cadeira Escritório Principal.png',
      carousel: '/img/items/Cadeira Escritório Carossel¹.png',
    },
    'Mesa de Escritório': {
      primary: '/img/items/Mesa Escritório Principal.png',
      carousel: '/img/items/Mesa Escritório Carrossel¹.png',
    },
    Climatizador: {
      primary: '/img/items/Climatizador Escritório Principal.png',
      carousel: '/img/items/Climatizador Escritório Carrossel¹.png',
    },
    'Guarda Sol': {
      primary: '/img/items/Guarda Sol Principal.png',
      carousel: '/img/items/Guarda Sol Carossel¹.png',
    },
    'Cadeira de Pesca': {
      primary: '/img/items/Cadeira Pesca Principal.png',
      carousel: '/img/items/Cadeira Pesca Carossel¹.png',
    },
    Boias: {
      primary: '/img/items/Boias Principal.png',
      carousel: '/img/items/Boia Carossel¹.png',
    },
    'Vara de Pescar': {
      primary: '/img/items/Vara de Pescar Principal.png',
      carousel: '/img/items/Vara de Pescar Carossel¹.png',
    },
    'Cadeira de Rodas': {
      primary: '/img/items/Cadeira de Rodas Principal.png',
      carousel: '/img/items/Cadeira de Rodas Carossel¹.png',
    },
    'Cadeira de Banho': {
      primary: '/img/items/Cadeira de Banho Principal.png',
      carousel: '/img/items/Cadeira de Banho Carrossel¹.png',
    },
    Muletas: {
      primary: '/img/items/Muleta Principal.png',
      carousel: '/img/items/Muleta Carrossel¹.png',
    },
    Bengala: {
      primary: '/img/items/Bengala Principal.png',
      carousel: '/img/items/Bengala Carrossel¹.png',
    },
    'Cadeira Infantil': {
      primary: '/img/items/Cadeira Infântil Principal.png',
      carousel: '/img/items/Cadeira Infântil Carrossel¹.png',
    },
    'Berço Portátil': {
      primary: '/img/items/Berço Portátil Principal.png',
      carousel: '/img/items/Berço Portáril Carrossel¹.png',
    },
  };

  // Buscar as imagens correspondentes ao título do item
  const images = imageMap[item.title] || {
    primary: '/img/placeholder.svg',
    carousel: '/img/placeholder.svg',
  };

  return {
    ...item,
    images: [images.primary, images.carousel],
  };
});

// Função auxiliar para simular delay em chamadas mockadas
export const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
