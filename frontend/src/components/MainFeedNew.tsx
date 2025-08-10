import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCategories } from '@/hooks/useCategories';
import { useItems } from '@/hooks/useItems';

// Função para gerar imagem baseada na categoria
const getCategoryImage = (categoryId: string) => {
  const categoryImages: { [key: string]: string } = {
    '1': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Ferramentas
    '2': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80', // Eletrônicos
    '3': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80', // Esportes
    '4': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Livros
    '5': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Móveis
    '6': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Casa e Jardim
    '7': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80', // Veículos
    '8': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Música
  };
  
  return categoryImages[categoryId] || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80';
};

export function MainFeedNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use real API hooks
  const { categories, loadCategories } = useCategories();
  const { items, loadItems, isLoading: itemsLoading, error: itemsError } = useItems();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load categories and items in parallel
        await Promise.all([
          loadCategories(),
          loadItems()
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadCategories, loadItems]);

  // Debug: log items data
  useEffect(() => {
    if (items.length > 0) {
      console.log('Items loaded:', items);
      console.log('First item structure:', items[0]);
    }
  }, [items]);

  if (isLoading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || itemsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error || itemsError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Itens Disponíveis</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Categorias ({categories.length})</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span 
                key={category.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Itens ({items.length})</h2>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const categoryImage = getCategoryImage(item.categoryId || item.category?.id || '1');
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1"
                    onClick={() => navigate(`/items/${item.id}`)}
                  >
                    {/* Imagem do item */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={categoryImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Overlay gradiente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      
                      {/* Preço - Destaque principal */}
                      <div className="absolute bottom-3 left-3">
                        <div className="rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
                          <div className="text-lg font-bold text-gray-900">
                            R$ {item.daily_rate || item.price || 'N/A'}
                          </div>
                          <div className="-mt-1 text-xs text-gray-600">
                            por dia
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="p-4 space-y-3">
                      {/* Título */}
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Descrição */}
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {item.description || 'Sem descrição disponível'}
                      </p>
                      
                      {/* Status de disponibilidade */}
                      <div className="flex items-center gap-1 text-sm">
                        <div className={`w-2 h-2 rounded-full ${item.is_available || item.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`font-medium ${item.is_available || item.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.is_available || item.status === 'available' ? 'Disponível agora' : 'Indisponível'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum item encontrado</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/add-item')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Adicionar Item
          </button>
        </div>
      </div>
    </div>
  );
}
