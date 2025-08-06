import React, { useState } from 'react';
import { MapPin, Heart, Share2, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCategoryPlaceholder, handleImageError } from '@/utils/imageUtils';
import type { Item, UserWithDetails } from '@/types';

interface ModernItemCardProps {
  item: Item;
  itemOwner?: UserWithDetails;
  variant?: 'default' | 'compact';
}

export function ModernItemCard({ item, itemOwner, variant = 'default' }: ModernItemCardProps) {
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

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
  };

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    const fallbackUrl = getCategoryPlaceholder(item.categoryId);
    handleImageError(event.nativeEvent, fallbackUrl);
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        !isAvailable && 'opacity-60',
        'rounded-2xl shadow-sm'
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Imagem */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <img
            src={mainImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={onImageError}
            loading="lazy"
          />

          {/* Overlay gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Status Badge - Apenas se indisponível */}
          {!isAvailable && (
            <div className="absolute left-3 top-3">
              <Badge className="border-0 bg-red-500 text-white shadow-lg">Indisponível</Badge>
            </div>
          )}

          {/* Ações - Aparecem no hover */}
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart className={cn('h-4 w-4', isFavorited && 'fill-red-500 text-red-500')} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
              onClick={handleShareClick}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Preço - Destaque principal */}
          <div className="absolute bottom-3 left-3">
            <div className="rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="text-lg font-bold text-foreground">{formatPrice(item.price)}</div>
              <div className="-mt-1 text-xs text-muted-foreground">
                por {getPeriodLabel(item.period)}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-3 p-4">
          {/* Título */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground">
            {item.title}
          </h3>

          {/* Descrição */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description || 'Sem descrição disponível'}
          </p>

          {/* Localização */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="truncate font-medium">
              {item.location?.city || item.location?.address || 'Localização não informada'}
            </span>
          </div>

          {/* Status de disponibilidade */}
          {isAvailable && (
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Disponível agora</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
