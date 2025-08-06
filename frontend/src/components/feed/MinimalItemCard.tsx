import React, { useState } from 'react';
import { MapPin, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCategoryPlaceholder, handleImageError } from '@/utils/imageUtils';
import type { Item, UserWithDetails } from '@/types';

interface MinimalItemCardProps {
  item: Item;
  itemOwner?: UserWithDetails;
}

export function MinimalItemCard({ item, itemOwner }: MinimalItemCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const mainImage = imageError
    ? getCategoryPlaceholder(item.categoryId)
    : item.images[0] || getCategoryPlaceholder(item.categoryId);

  const isAvailable = item.status === 'available';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPeriodLabel = (period?: string) => {
    const labels: Record<string, string> = {
      hora: 'h',
      dia: 'dia',
      semana: 'sem',
      mes: 'mês',
    };
    return period ? labels[period] || period : 'dia';
  };

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    const fallbackUrl = getCategoryPlaceholder(item.categoryId);
    handleImageError(event.nativeEvent, fallbackUrl);
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 bg-white transition-all duration-200 hover:shadow-lg',
        !isAvailable && 'opacity-50',
        'rounded-xl'
      )}
      onClick={handleCardClick}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={item.title}
          className="h-full w-full object-cover"
          onError={onImageError}
          loading="lazy"
        />

        {/* Botão de favorito - sempre visível */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={handleFavoriteClick}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-red-500 text-red-500')} />
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="space-y-2 p-3">
        {/* Preço e Título */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 text-sm font-semibold text-foreground">
            {item.title}
          </h3>
          <div className="flex-shrink-0 text-right">
            <div className="font-bold text-foreground">{formatPrice(item.price)}</div>
            <div className="text-xs text-muted-foreground">/{getPeriodLabel(item.period)}</div>
          </div>
        </div>

        {/* Descrição compacta */}
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {item.description || 'Sem descrição disponível'}
        </p>

        {/* Localização e Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0 text-blue-500" />
            <span className="truncate font-medium">
              {item.location?.city || 'Localização não informada'}
            </span>
          </div>
          {isAvailable && <span className="text-xs font-medium text-emerald-600">Disponível</span>}
        </div>
      </div>
    </Card>
  );
}
