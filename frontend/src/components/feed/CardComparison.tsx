import { ItemCard } from './ItemCard';
import { ModernItemCard } from './ModernItemCard';
import { MinimalItemCard } from './MinimalItemCard';
import type { Item, UserWithDetails } from '@/types';

// Mock data para demonstração
const mockItem: Item = {
  id: '1',
  title: 'Furadeira Elétrica Bosch Professional',
  description:
    'Furadeira de impacto profissional, ideal para trabalhos pesados. Inclui maleta e brocas.',
  price: 25,
  period: 'dia',
  images: ['/placeholder.svg'],
  categoryId: 'ferramentas',
  categoryName: 'Ferramentas',
  ownerId: '1',
  status: 'available',
  location: {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'São Paulo, SP',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockOwner: UserWithDetails = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  avatar: '/avatar-placeholder.png',
  rating: 4.8,
  verified: true,
  location: {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'São Paulo, SP',
    city: 'São Paulo',
    state: 'SP',
  },
};

export function CardComparison() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Comparação de Designs de Cards</h1>
          <p className="text-gray-600">Análise de diferentes abordagens para os cards de itens</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Card Atual */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Card Atual</h2>
              <p className="text-sm text-gray-600">Design existente com muitas informações</p>
            </div>
            <div className="mx-auto max-w-sm">
              <ItemCard item={mockItem} itemOwner={mockOwner} />
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>✅ Informações completas</p>
              <p>❌ Sobrecarga visual</p>
              <p>❌ Hierarquia confusa</p>
              <p>❌ Muitos elementos</p>
            </div>
          </div>

          {/* Card Moderno */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Card Moderno</h2>
              <p className="text-sm text-gray-600">Design equilibrado e limpo</p>
            </div>
            <div className="mx-auto max-w-sm">
              <ModernItemCard item={mockItem} itemOwner={mockOwner} />
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>✅ Hierarquia clara</p>
              <p>✅ Preço em destaque</p>
              <p>✅ Ações no hover</p>
              <p>✅ Design limpo</p>
            </div>
          </div>

          {/* Card Minimalista */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Card Minimalista</h2>
              <p className="text-sm text-gray-600">Foco total no essencial</p>
            </div>
            <div className="mx-auto max-w-sm">
              <MinimalItemCard item={mockItem} itemOwner={mockOwner} />
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>✅ Extremamente limpo</p>
              <p>✅ Scan rápido</p>
              <p>✅ Foco no preço</p>
              <p>❌ Menos informações</p>
            </div>
          </div>
        </div>

        {/* Análise Comparativa */}
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Análise Comparativa</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Hierarquia da Informação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Atual:</span>
                  <span className="text-red-600">❌ Confusa</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Moderno:</span>
                  <span className="text-green-600">✅ Clara</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Minimalista:</span>
                  <span className="text-green-600">✅ Muito Clara</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Velocidade de Scan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Atual:</span>
                  <span className="text-red-600">❌ Lenta</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Moderno:</span>
                  <span className="text-green-600">✅ Boa</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Minimalista:</span>
                  <span className="text-green-600">✅ Muito Rápida</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Conversão Esperada</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Atual:</span>
                  <span className="text-yellow-600">⚠️ Média</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Moderno:</span>
                  <span className="text-green-600">✅ Alta</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Minimalista:</span>
                  <span className="text-green-600">✅ Muito Alta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-blue-900">💡 Recomendação</h2>
          <p className="mb-4 text-blue-800">
            O <strong>Card Moderno</strong> oferece o melhor equilíbrio entre informação e
            usabilidade:
          </p>
          <ul className="space-y-2 text-blue-700">
            <li>
              • <strong>Preço em destaque</strong> - Principal fator de decisão
            </li>
            <li>
              • <strong>Hierarquia clara</strong> - Título → Preço → Localização → Proprietário
            </li>
            <li>
              • <strong>Ações no hover</strong> - Interface limpa mas funcional
            </li>
            <li>
              • <strong>Design moderno</strong> - Alinhado com tendências atuais
            </li>
            <li>
              • <strong>Mobile-friendly</strong> - Otimizado para toque
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
