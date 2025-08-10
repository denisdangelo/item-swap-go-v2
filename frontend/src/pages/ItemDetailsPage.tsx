import { Loader2, MapPin, MessageCircle, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ImageCarousel from '@/components/details/ImageCarousel';
import { AppHeader } from '@/components/ui/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { itemsApiService } from '@/services/api/index';

import type { ItemWithDetails } from '@/types';

// Função para construir URL completa de imagem
const buildImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http')) {
    return imageUrl; // URL completa já
  }
  if (imageUrl.startsWith('/')) {
    return `http://localhost:3001${imageUrl}`; // URL relativa -> completa
  }
  return `http://localhost:3001/uploads/${imageUrl}`; // Apenas filename
};

function ItemDetailsPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState<ItemWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!itemId) {
          throw new Error('ID do item não fornecido');
        }
        setLoading(true);
        setError(null);
        const data = await itemsApiService.getItemById(itemId);
        if (!data.owner || !data.category) {
          throw new Error('Dados do item incompletos');
        }
        setItem(data);
      } catch (err) {
        console.error('Erro ao carregar item:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleShare = async () => {
    if (!item) return;

    try {
      const shareData = {
        title: item.title,
        text: item.description,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: 'Item compartilhado!',
          description: 'O link foi compartilhado com sucesso.',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copiado!',
          description: 'O link do item foi copiado para a área de transferência.',
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Erro ao compartilhar',
          description: 'Não foi possível compartilhar o item. Tente novamente.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFavorite = () => {
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    toast({
      title: newFavoritedState ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!',
      description: newFavoritedState
        ? 'O item foi adicionado à sua lista de favoritos.'
        : 'O item foi removido da sua lista de favoritos.',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getPeriodLabel = (period?: string) => {
    const labels: Record<string, string> = {
      hora: 'hora',
      dia: 'dia',
      semana: 'semana',
      mes: 'mês',
    };
    return period ? `/${labels[period]}` : '';
  };

  const handleQuickLoan = () => {
    if (!isAvailable) return;
    navigate(`/items/${item?.id}/loan`);
  };

  const handleStartChat = () => {
    navigate(`/chat/${item?.id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando detalhes do item...</span>
      </div>
    );
  }

  if (error || !item || !item.owner || !item.category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-red-200 bg-white p-8 shadow-2xl">
          <div className="flex w-full flex-col items-center rounded-lg border-0 bg-red-50 p-4 text-center shadow-none">
            <div className="mb-2 flex items-center justify-center gap-2 text-xl font-bold text-red-700">
              <X className="h-6 w-6 text-red-500" aria-hidden="true" />
              Item não encontrado
            </div>
            <div className="mt-2 text-base text-red-600">
              O item que você tentou acessar não existe, foi removido ou está indisponível.
              <br />
              Verifique se o link está correto ou escolha outro item.
            </div>
          </div>
          <div className="flex w-full justify-center gap-3">
            <Button
              className="h-12 flex-1 rounded-xl bg-purple-600 text-base font-semibold text-white shadow transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              onClick={() => navigate('/')}
              aria-label="Voltar ao início"
            >
              Ir para o início
            </Button>
            <Button
              className="h-12 flex-1 rounded-xl border-gray-300 bg-white text-base font-semibold text-gray-700 shadow transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              variant="outline"
              onClick={() => navigate(-1)}
              aria-label="Voltar à página anterior"
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { owner, category } = item;
  const isAvailable = item.status === 'available';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Detalhes do Item"
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : null
        }
      />

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-20">
        {/* Carrossel de Imagens */}
        <div className="mb-6">
          <ImageCarousel
            images={item.images.map(img => buildImageUrl(img.url))}
            title={item.title}
            currentIndex={currentImageIndex}
            setCurrentIndex={setCurrentImageIndex}
            available={isAvailable}
          />
        </div>

        {/* Informações Essenciais */}
        <div className="space-y-4">
          {/* Título e Status */}
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{item.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {category.name}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  isAvailable
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isAvailable ? 'Disponível' : 'Indisponível'}
              </Badge>
            </div>
          </div>

          {/* Preço */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(item.price)}
            <span className="ml-2 text-lg font-normal text-muted-foreground">
              {getPeriodLabel(item.period)}
            </span>
          </div>

          {/* Descrição */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="leading-relaxed text-muted-foreground">{item.description}</p>
          </div>

          {/* Proprietário */}
          <div className="flex items-center gap-3 rounded-lg border bg-white p-4">
            <img
              alt={owner.name}
              className="h-10 w-10 rounded-full"
              src={owner.avatar || '/avatar-placeholder.png'}
            />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{owner.name}</h3>
              {owner.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-muted-foreground">{owner.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {item.location?.city ||
                item.location?.address ||
                'Localização disponível após contato'}
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={handleQuickLoan}
              disabled={!isAvailable}
              className="h-12 font-semibold"
            >
              {isAvailable ? 'Reservar' : 'Indisponível'}
            </Button>
            <Button onClick={handleStartChat} variant="outline" className="h-12 font-semibold">
              <MessageCircle className="mr-2 h-4 w-4" />
              Conversar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;
