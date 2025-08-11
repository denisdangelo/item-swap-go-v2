import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/ui/page-container';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { itemsApiService } from '@/services/api/index';

import type { ItemWithDetails } from '@/services/api/ItemsApiService';

// Declare HTMLImageElement for TypeScript
declare global {
  interface Window {
    HTMLImageElement: typeof HTMLImageElement;
  }
}

const buildImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return `http://localhost:3001${imageUrl}`;
  return `http://localhost:3001/uploads/${imageUrl}`;
};

const getCategoryImage = (categoryName: string) => {
  const categoryImages: { [key: string]: string } = {
    'Ferramentas': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80',
    'Eletrônicos': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80',
    'Esportes': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80',
    'Livros e Mídia': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
    'Casa e Jardim': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80',
    'Música': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80',
    'Roupas e Acessórios': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80',
    'Veículos': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80',
  };
  return categoryImages[categoryName] || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80';
};

function MyItemsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [items, setItems] = useState<ItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await itemsApiService.getMyItems();
        setItems(response);
      } catch (err) {
        console.error('Erro ao carregar meus itens:', err);
        setError('Erro ao carregar seus itens. Tente novamente.');
        toast({
          title: 'Erro ao carregar itens',
          description: 'Não foi possível carregar seus itens. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [toast]);

  const handleEditItem = (itemId: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A edição de itens será implementada em breve.',
    });
  };

  const handleDeleteItem = (itemId: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A exclusão de itens será implementada em breve.',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          onBack={() => navigate(-1)}
          showBackButton
          title="Meus Itens"
          user={user}
        />
        <PageContainer>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-muted-foreground">Carregando seus itens...</span>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onBack={() => navigate(-1)}
        showBackButton
        title="Meus Itens"
        user={user}
      />
      
      <PageContainer>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus Itens</h1>
            <p className="text-muted-foreground">
              Gerencie os itens que você disponibilizou para aluguel
            </p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => navigate('/add-item')}>
            <Plus className="h-4 w-4" />
            Adicionar Item
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600">{error}</p>
                <Button 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                  variant="outline" 
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Nenhum item encontrado</h3>
                <p className="mb-4 text-muted-foreground">
                  Você ainda não adicionou nenhum item para aluguel.
                </p>
                <Button onClick={() => navigate('/add-item')}>
                  Adicionar Primeiro Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const hasRealImages = item.images && item.images.length > 0;
              const imageUrl = hasRealImages 
                ? buildImageUrl(item.images[0].url)
                : getCategoryImage(item.category?.name || 'Ferramentas');
              
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallbackUrl = getCategoryImage(item.category?.name || 'Ferramentas');
                        if (target.src !== fallbackUrl) {
                          target.src = fallbackUrl;
                        }
                      }}
                      src={imageUrl}
                    />
                    
                    <div className="absolute right-3 top-3">
                      <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_available ? 'Disponível' : 'Indisponível'}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.category?.name}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(item.daily_rate || item.estimated_value || 0)}
                        </span>
                        <span className="text-sm text-muted-foreground">/dia</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleEditItem(item.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleDeleteItem(item.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
}

export default MyItemsPage;
